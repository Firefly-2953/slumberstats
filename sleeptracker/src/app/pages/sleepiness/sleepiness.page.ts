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
  IonSelect, IonSelectOption
} from '@ionic/angular/standalone';

import { SleepService } from '../../services/sleep.service';
import { StanfordSleepinessData } from '../../data/stanford-sleepiness-data';

@Component({
  selector: 'app-sleepiness',
  templateUrl: 'sleepiness.page.html',
  styleUrls: ['sleepiness.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonItem, IonLabel,
    IonButton,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonModal, IonDatetime,
    IonSelect, IonSelectOption
  ],
})
export class SleepinessPage {
  // inject and add alert controller for error popups
  constructor(
    public sleepService: SleepService,
    private alertCtrl: AlertController
  ) {}

  // helper to convert time to local ISO so the default time shows correctly
  private toLocalIso(d: Date): string {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  // default values
  sleepinessValue: number = 3;
  sleepinessTimeISO: string = this.toLocalIso(new Date());

  // get description for selected sleepiness value
  get selectedSleepinessDescription(): string {
    return StanfordSleepinessData.ScaleValues[this.sleepinessValue] || '';
  }

  // format selected date/time for the "Pick" button display
  formatDateTime(value: string): string {
    const d = new Date(value);
    if (isNaN(d.getTime())) return 'Pick';

    return d.toLocaleString([], {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  }

  // add sleepiness log w/ error handling for invalid values and future times
  async addSleepinessLog() {
    const value = Number(this.sleepinessValue); // ensure it's a number

    // make sure its between 1 and 7, even though the select options should prevent this, its just incase ionic defaults or something
    if (value < 1 || value > 7) {
      const errorAlert = await this.alertCtrl.create({
        header: 'Invalid Sleepiness Level',
        message: 'Pick a sleepiness value from 1 to 7.',
        buttons: ['OK']
      });

      await errorAlert.present();
      return;
    }
    //create a date object, grab current time for errors
    const loggedAt = new Date(this.sleepinessTimeISO);
    const now = new Date();

    // no logging in the future
    if (loggedAt > now) {
      const futureAlert = await this.alertCtrl.create({
        header: 'Future Entry Not Allowed',
        message: 'Sleepiness logs cannot be entered in the future.',
        buttons: ['OK']
      });

      await futureAlert.present();
      return;
    }
    // save if valid
    this.sleepService.logSleepinessData(
      new StanfordSleepinessData(value, loggedAt)
    );
  }

  //grabs saved data for sleepiness, to use later
  get allSleepinessData() {
    return SleepService.AllSleepinessData;
  }

//returns recently logged entries, or null
  get lastSleepinessEntry() {
    const data = this.allSleepinessData;
    if (!data || data.length === 0) return null;
    return data[data.length - 1];
  }

  //returns recently logged description, or empty string if no data
  get lastSleepinessDescription(): string {
    const entry = this.lastSleepinessEntry;
    if (!entry) return '';
    return StanfordSleepinessData.ScaleValues[entry.getLoggedValue()] || '';
  }

  //for the last check-in, shows time in a time ago format
  timeAgo(date: Date): string {
    const diff = Math.floor((Date.now() - date.getTime()) / 1000);

    const minutes = Math.floor(diff / 60);
    const hours = Math.floor(diff / 3600);

    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;

    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
}
