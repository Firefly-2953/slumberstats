import { Injectable } from '@angular/core';
import { SleepData } from '../data/sleep-data';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';

@Injectable({
  providedIn: 'root'
})
export class SleepService {
  private static LoadDefaultData:boolean = true;

  private static STORAGE_KEY_OVERNIGHT = 'sleeptracker_overnight_v1';
  private static STORAGE_KEY_SLEEPINESS = 'sleeptracker_sleepiness_v1';

  public static AllSleepData:SleepData[] = [];
  public static AllOvernightData:OvernightSleepData[] = [];
  public static AllSleepinessData:StanfordSleepinessData[] = [];

  constructor() {
    // 1) Try to load saved data first
    const loaded = this.loadFromStorage();

    // 2) If nothing saved yet, fall back to the starter fake data once
    if (!loaded && SleepService.LoadDefaultData) {
      this.addDefaultData();
      SleepService.LoadDefaultData = false;
      this.saveToStorage(); // save the default data too
    }
  }

  private addDefaultData() {
    let goToBed = new Date();
    goToBed.setDate(goToBed.getDate() - 1); // yesterday
    goToBed.setHours(1, 3, 0); // 1:03am

    let wakeUp = new Date();
    wakeUp.setTime(goToBed.getTime() + 8 * 60 * 60 * 1000);
    this.logOvernightData(new OvernightSleepData(goToBed, wakeUp));

    let sleepinessDate = new Date();
    sleepinessDate.setDate(sleepinessDate.getDate() - 1);
    sleepinessDate.setHours(14, 38, 0); // 2:38pm
    this.logSleepinessData(new StanfordSleepinessData(4, sleepinessDate));

    goToBed = new Date();
    goToBed.setDate(goToBed.getDate() - 1);
    goToBed.setHours(23, 11, 0); // 11:11pm

    wakeUp = new Date();
    wakeUp.setTime(goToBed.getTime() + 9 * 60 * 60 * 1000);
    this.logOvernightData(new OvernightSleepData(goToBed, wakeUp));
  }

  public logOvernightData(sleepData:OvernightSleepData) {
    SleepService.AllSleepData.push(sleepData);
    SleepService.AllOvernightData.push(sleepData);
    this.saveToStorage();
  }

  public logSleepinessData(sleepData:StanfordSleepinessData) {
    SleepService.AllSleepData.push(sleepData);
    SleepService.AllSleepinessData.push(sleepData);
    this.saveToStorage();
  }

  // ===== LocalStorage save/load =====

  private saveToStorage() {
    const overnightToSave = SleepService.AllOvernightData.map(o => ({
      sleepStart: o.getSleepStart().toISOString(),
      sleepEnd: o.getSleepEnd().toISOString(),
    }));

    const sleepinessToSave = SleepService.AllSleepinessData.map(s => ({
      loggedValue: s.getLoggedValue(),
      loggedAt: s.loggedAt.toISOString(),
    }));

    localStorage.setItem(SleepService.STORAGE_KEY_OVERNIGHT, JSON.stringify(overnightToSave));
    localStorage.setItem(SleepService.STORAGE_KEY_SLEEPINESS, JSON.stringify(sleepinessToSave));
  }

  private loadFromStorage(): boolean {
    const overnightRaw = localStorage.getItem(SleepService.STORAGE_KEY_OVERNIGHT);
    const sleepinessRaw = localStorage.getItem(SleepService.STORAGE_KEY_SLEEPINESS);

    if (!overnightRaw && !sleepinessRaw) return false;

    // clear current arrays
    SleepService.AllSleepData = [];
    SleepService.AllOvernightData = [];
    SleepService.AllSleepinessData = [];

    if (overnightRaw) {
      try {
        const overnightArr: { sleepStart: string; sleepEnd: string }[] = JSON.parse(overnightRaw);
        overnightArr.forEach(o => {
          const start = new Date(o.sleepStart);
          const end = new Date(o.sleepEnd);
          const obj = new OvernightSleepData(start, end);
          SleepService.AllOvernightData.push(obj);
          SleepService.AllSleepData.push(obj);
        });
      } catch (e) {
        console.warn('Failed to parse overnight storage:', e);
      }
    }

    if (sleepinessRaw) {
      try {
        const sleepyArr: { loggedValue: number; loggedAt: string }[] = JSON.parse(sleepinessRaw);
        sleepyArr.forEach(s => {
          const at = new Date(s.loggedAt);
          const obj = new StanfordSleepinessData(s.loggedValue, at);
          SleepService.AllSleepinessData.push(obj);
          SleepService.AllSleepData.push(obj);
        });
      } catch (e) {
        console.warn('Failed to parse sleepiness storage:', e);
      }
    }

    SleepService.LoadDefaultData = false;
    return true;
  }

  // optional: handy for testing / demo if you want a reset button later
  public clearAllData() {
    SleepService.AllSleepData = [];
    SleepService.AllOvernightData = [];
    SleepService.AllSleepinessData = [];
    localStorage.removeItem(SleepService.STORAGE_KEY_OVERNIGHT);
    localStorage.removeItem(SleepService.STORAGE_KEY_SLEEPINESS);
  }
}
