import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonItem, IonLabel,
  IonButton,
  IonDatetimeButton, IonModal, IonDatetime,
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
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonItem, IonLabel,
    IonButton,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonDatetimeButton, IonModal, IonDatetime,
    IonSelect, IonSelectOption
  ],
})
export class SleepinessPage {
  constructor(public sleepService: SleepService) {}

  // helper to convert time to local time, for default ease
  private toLocalIso(d: Date): string {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  // Sleepiness logging (with current time default)
  sleepinessValue: number = 3;
  sleepinessTimeISO: string = this.toLocalIso(new Date());

  // helper to grab description for sleepiness value
  get sleepinessDescription(): string {
    return StanfordSleepinessData.ScaleValues[this.sleepinessValue] || '';
  }

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
