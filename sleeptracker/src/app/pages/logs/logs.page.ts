import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertController } from '@ionic/angular';

import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonLabel,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonButton,
  IonItemSliding, IonItemOptions, IonItemOption
} from '@ionic/angular/standalone';

import { SleepService } from '../../services/sleep.service';
import { OvernightSleepData } from '../../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../../data/stanford-sleepiness-data';

@Component({
  selector: 'app-logs',
  templateUrl: 'logs.page.html',
  styleUrls: ['logs.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonList, IonItem, IonLabel,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonButton,
    IonItemSliding, IonItemOptions, IonItemOption
  ],
})
export class LogsPage {
  constructor(
    public sleepService: SleepService,
    private alertCtrl: AlertController
  ) {}

  get allOvernightData() {
    return SleepService.AllOvernightData;
  }

  get allSleepinessData() {
    return SleepService.AllSleepinessData;
  }

  get totalLogs(): number {
    return this.allOvernightData.length + this.allSleepinessData.length;
  }

  get averageSleep(): string {
    if (this.allOvernightData.length === 0) return '--';

    const totalMs = this.allOvernightData.reduce((sum, sleep) => {
      return sum + (sleep.getSleepEnd().getTime() - sleep.getSleepStart().getTime());
    }, 0);

    const avgMs = totalMs / this.allOvernightData.length;
    const hours = Math.floor(avgMs / (1000 * 60 * 60));
    const minutes = Math.round((avgMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  }

  get averageSleepiness(): string {
    if (this.allSleepinessData.length === 0) return '--';

    const total = this.allSleepinessData.reduce((sum, entry) => {
      return sum + entry.getLoggedValue();
    }, 0);

    return (total / this.allSleepinessData.length).toFixed(1);
  }

  async confirmDeleteOvernight(entry: OvernightSleepData, slidingItem: IonItemSliding) {
    const alert = await this.alertCtrl.create({
      header: 'Delete log?',
      message: 'Are you sure you want to delete this overnight sleep log?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: async () => {
            await slidingItem.close();
          }
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: async () => {
            this.deleteOvernight(entry);
            await slidingItem.close();
          }
        }
      ]
    });

    await alert.present();
  }

  async confirmDeleteSleepiness(entry: StanfordSleepinessData, slidingItem: IonItemSliding) {
    const alert = await this.alertCtrl.create({
      header: 'Delete log?',
      message: 'Are you sure you want to delete this sleepiness log?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: async () => {
            await slidingItem.close();
          }
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: async () => {
            this.deleteSleepiness(entry);
            await slidingItem.close();
          }
        }
      ]
    });

    await alert.present();
  }

  deleteOvernight(entry: OvernightSleepData) {
    const overnightIndex = SleepService.AllOvernightData.indexOf(entry);
    if (overnightIndex > -1) {
      SleepService.AllOvernightData.splice(overnightIndex, 1);
    }

    const allIndex = SleepService.AllSleepData.indexOf(entry);
    if (allIndex > -1) {
      SleepService.AllSleepData.splice(allIndex, 1);
    }

    // If your SleepService has a save/persist method, call it here.
    // Example: this.sleepService.saveData();
  }

  deleteSleepiness(entry: StanfordSleepinessData) {
    const sleepinessIndex = SleepService.AllSleepinessData.indexOf(entry);
    if (sleepinessIndex > -1) {
      SleepService.AllSleepinessData.splice(sleepinessIndex, 1);
    }

    const allIndex = SleepService.AllSleepData.indexOf(entry);
    if (allIndex > -1) {
      SleepService.AllSleepData.splice(allIndex, 1);
    }

    // If your SleepService has a save/persist method, call it here.
    // Example: this.sleepService.saveData();
  }

  async confirmClearAll() {
    const alert = await this.alertCtrl.create({
      header: 'Clear all data?',
      message: 'Are you sure you want to delete ALL logs? This cannot be undone.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Clear All',
          role: 'destructive',
          handler: () => {
            this.clearAllData();
          }
        }
      ]
    });

    await alert.present();
  }

  clearAllData() {
    SleepService.AllOvernightData = [];
    SleepService.AllSleepinessData = [];
    SleepService.AllSleepData = [];

    // If your SleepService has a save/persist method, call it here.
    // Example: this.sleepService.saveData();
  }
}
