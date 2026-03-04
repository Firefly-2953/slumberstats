import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonLabel,
  IonButton,
  IonDatetimeButton, IonModal, IonDatetime,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonSelect, IonSelectOption, IonText
} from '@ionic/angular/standalone';

import { SleepService } from '../services/sleep.service';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    CommonModule, FormsModule,

    IonHeader, IonToolbar, IonTitle, IonContent,
    IonList, IonItem, IonLabel,
    IonButton,

    IonCard, IonCardHeader, IonCardTitle, IonCardContent,

    IonDatetimeButton, IonModal, IonDatetime,

    IonSelect, IonSelectOption
  ],
})
export class HomePage {
  constructor(public sleepService: SleepService) {}

  ngOnInit() {
    console.log(this.allSleepData);
  }

  /* Ionic doesn't allow bindings to static variables, so this getter can be used instead. */
  get allSleepData() {
    return SleepService.AllSleepData;
  }

  get allOvernightData() {
    return SleepService.AllOvernightData;
  }

  get allSleepinessData() {
    return SleepService.AllSleepinessData;
  }
  //helper to grad description for sleepiness value 
  get sleepinessDescription(): string {
  return StanfordSleepinessData.ScaleValues[this.sleepinessValue] || '';
}

  //added helper to convert time to local time, for default ease
  private toLocalIso(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

  // ----- Pick night of, bedtime, wake time ----

  // Defaults to yesterday
  nightOfISO: string = (() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString();
  })();

  bedTimeISO: string = new Date().toISOString();
  wakeTimeISO: string = new Date().toISOString();

  addOvernightSleepFromTimes() {
    const night = new Date(this.nightOfISO);
    const bed = new Date(this.bedTimeISO);
    const wake = new Date(this.wakeTimeISO);

    // Start = nightOf date + bedtime time
    const start = new Date(night);
    start.setHours(bed.getHours(), bed.getMinutes(), 0, 0);

    // End = nightOf date + wake time (if it's <= start, bump to next day)
    const end = new Date(night);
    end.setHours(wake.getHours(), wake.getMinutes(), 0, 0);
    if (end <= start) {
      end.setDate(end.getDate() + 1);
    }

    if (end <= start) {
      alert('Wake time must be after bedtime.');
      return;
    }

    this.sleepService.logOvernightData(new OvernightSleepData(start, end));
  }

  // Sleepiness logging (with current time default)
  sleepinessValue: number = 3;
  sleepinessTimeISO: string = this.toLocalIso(new Date());

  addSleepinessLog() {
    const value = Number(this.sleepinessValue);

    if (value < 1 || value > 7) {
      alert('Pick a sleepiness value from 1 to 7.');
      return;
    }

    const loggedAt = new Date(this.sleepinessTimeISO);
    this.sleepService.logSleepinessData(new StanfordSleepinessData(value, loggedAt));
  }
}
