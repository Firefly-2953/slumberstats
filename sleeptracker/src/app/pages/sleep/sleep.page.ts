import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController } from '@ionic/angular';

import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonItem, IonLabel,
  IonButton,
  IonModal, IonDatetime,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent,
} from '@ionic/angular/standalone';

import { SleepService } from '../../services/sleep.service';
import { OvernightSleepData } from '../../data/overnight-sleep-data';

@Component({
  selector: 'app-sleep',
  templateUrl: 'sleep.page.html',
  styleUrls: ['sleep.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonItem, IonLabel,
    IonButton,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonModal, IonDatetime,
  ],
})
export class SleepPage {
  constructor(public sleepService: SleepService, private alertCtrl: AlertController) {}

  // set to the day before
  nightOfISO: string = (() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString();
  })();

  // defaults to 8 hours before, since that will be around when people went to sleep
  bedTimeISO: string = (() => {
    const d = new Date();
    d.setHours(d.getHours() - 8);
    return d.toISOString();
  })();

  wakeTimeISO: string = new Date().toISOString();

  //creates a overnight sleep entry
  async addOvernightSleepFromTimes() {
    const night = new Date(this.nightOfISO);
    const bed = new Date(this.bedTimeISO);
    const wake = new Date(this.wakeTimeISO);

    const start = new Date(night);
    start.setHours(bed.getHours(), bed.getMinutes(), 0, 0);

    //move to the next day for after midnight
    const end = new Date(night);
    end.setHours(wake.getHours(), wake.getMinutes(), 0, 0);
    if (end <= start) end.setDate(end.getDate() + 1);

    // error handling if wake time is before or the same as bed time 
    if (end <= start) {
      const errorAlert = await this.alertCtrl.create({
        header: 'Invalid Time',
        message: 'Wake time must be after bedtime.',
        buttons: ['OK']
      });

      await errorAlert.present();
      return;
    }

    const now = new Date();
    //error handling for future times
    if (start > now || end > now) {
      const futureAlert = await this.alertCtrl.create({
        header: 'Future Entry Not Allowed',
        message: 'Sleep logs cannot be entered in the future.',
        buttons: ['OK']
      });

      await futureAlert.present();
      return;
    }

    const duration = this.durationString(start, end);

    //confirms before saving
    const alert = await this.alertCtrl.create({
      header: 'Confirm sleep log',
      message: `You slept ${duration}. Is that correct?`,
      buttons: [
        {
          text: 'Edit',
          role: 'cancel'
        },
        {
          text: 'Save',
          handler: () => {
            this.sleepService.logOvernightData(new OvernightSleepData(start, end));
          }
        }
      ]
    });

    await alert.present();
  }

  //formats so its in a nice format
  formatNight(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
  }
  // format nicely
  formatTime(value: string): string {
    if (/^\d{2}:\d{2}$/.test(value)) {
      const [hh, mm] = value.split(':').map(Number);
      const d = new Date();
      d.setHours(hh, mm, 0, 0);
      return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    }
    
    //for no date or invalid, default to pick
    const d = new Date(value);
    if (isNaN(d.getTime())) return 'Pick';
    return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }

  private durationString(start: Date, end: Date): string {
    const diffMin = Math.round((end.getTime() - start.getTime()) / 60000);
    const h = Math.floor(diffMin / 60);
    const m = diffMin % 60;
    return `${h} hour${h === 1 ? '' : 's'}${m ? `, ${m} minute${m === 1 ? '' : 's'}` : ''}`;
  }

  //returns most recent overnight sleep or null if there arent any
  get lastOvernightEntry(): OvernightSleepData | null {
    const data = SleepService.AllOvernightData;
    if (!data || data.length === 0) return null;
    return data[data.length - 1];
  }
  
  // for displaying the recent sleep log 
  get lastNightSummary() {
    const entry = this.lastOvernightEntry;
    if (!entry) return null;

    const start = entry.getSleepStart();
    const end = entry.getSleepEnd();

    return {
      date: entry.dateString(),
      duration: entry.summaryString(),
      bedtime: start.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
      wakeTime: end.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
    };
  }

  // switches greeting based on time of day
  get greeting(): string {
    const hour = new Date().getHours();

    if (hour < 12) {
      return 'Good morning, Emily ☀️';
    } else if (hour < 18) {
      return 'Good afternoon, Emily 🌤️';
    } else {
      return 'Good evening, Emily 🌙';
    }
  }
}