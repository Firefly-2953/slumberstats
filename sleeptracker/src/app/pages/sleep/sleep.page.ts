import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController } from '@ionic/angular';

import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonItem, IonLabel,
  IonButton,
  IonDatetimeButton, IonModal, IonDatetime,
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
  IonDatetimeButton, IonModal, IonDatetime,
],
})
export class SleepPage {
  constructor(public sleepService: SleepService, private alertCtrl: AlertController) {}

  // Defaults to yesterday for easy input
  nightOfISO: string = (() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString();
  })();

  bedTimeISO: string = new Date().toISOString();
  wakeTimeISO: string = new Date().toISOString();

  //set time
  async addOvernightSleepFromTimes() {
  const night = new Date(this.nightOfISO);
  const bed = new Date(this.bedTimeISO);
  const wake = new Date(this.wakeTimeISO);

  const start = new Date(night);
  start.setHours(bed.getHours(), bed.getMinutes(), 0, 0);

  const end = new Date(night);
  end.setHours(wake.getHours(), wake.getMinutes(), 0, 0);
  if (end <= start) end.setDate(end.getDate() + 1);

  if (end <= start) {
  const errorAlert = await this.alertCtrl.create({
    header: 'Invalid Time',
    message: 'Wake time must be after bedtime.',
    buttons: ['OK']
  });

  await errorAlert.present();
  return;
}

  const duration = this.durationString(start, end);

  //notification pop up to confirm sleep log, edit cancels and doesnt log
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

  formatNight(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

formatTime(value: string): string {
  // format time
  if (/^\d{2}:\d{2}$/.test(value)) {
    const [hh, mm] = value.split(':').map(Number);
    const d = new Date();
    d.setHours(hh, mm, 0, 0);
    return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }

  //return pick if not valid time for the buttons, otherwise show the time
  const d = new Date(value);
  if (isNaN(d.getTime())) return 'Pick';
  return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}
  //format for hours and mins
  private durationString(start: Date, end: Date): string {
    const diffMin = Math.round((end.getTime() - start.getTime()) / 60000);
    const h = Math.floor(diffMin / 60);
    const m = diffMin % 60;
    return `${h} hour${h === 1 ? '' : 's'}${m ? `, ${m} minute${m === 1 ? '' : 's'}` : ''}`;
  }
}
