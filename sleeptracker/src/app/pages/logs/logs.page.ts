import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonLabel
} from '@ionic/angular/standalone';

import { SleepService } from '../../services/sleep.service';

@Component({
  selector: 'app-logs',
  templateUrl: 'logs.page.html',
  styleUrls: ['logs.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonList, IonItem, IonLabel
  ],
})
export class LogsPage {
  constructor(public sleepService: SleepService) {}

  get allOvernightData() {
    return SleepService.AllOvernightData;
  }

  get allSleepinessData() {
    return SleepService.AllSleepinessData;
  }
}
