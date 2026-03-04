import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  constructor(public sleepService: SleepService) {}

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
    if (end <= start) end.setDate(end.getDate() + 1);

    if (end <= start) {
      alert('Wake time must be after bedtime.');
      return;
    }

    this.sleepService.logOvernightData(new OvernightSleepData(start, end));
  }

  formatNight(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

formatTime(value: string): string {
  // If value is "HH:mm" (time-only), format it nicely
  if (/^\d{2}:\d{2}$/.test(value)) {
    const [hh, mm] = value.split(':').map(Number);
    const d = new Date();
    d.setHours(hh, mm, 0, 0);
    return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }

  // Otherwise parse as date/time
  const d = new Date(value);
  if (isNaN(d.getTime())) return 'Pick';
  return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}
}
