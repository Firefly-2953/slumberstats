import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertController } from '@ionic/angular';

import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonLabel,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonButton,
  IonItemSliding, IonItemOptions, IonItemOption,
  IonAccordion, IonAccordionGroup
} from '@ionic/angular/standalone';

import { Chart, registerables } from 'chart.js';

import { SleepService } from '../../services/sleep.service';
import { OvernightSleepData } from '../../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../../data/stanford-sleepiness-data';

Chart.register(...registerables);

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
    IonItemSliding, IonItemOptions, IonItemOption,
    IonAccordion, IonAccordionGroup
  ],
})
export class LogsPage implements AfterViewInit {
  @ViewChild('sleepChartCanvas') sleepChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('sleepinessChartCanvas') sleepinessChartCanvas!: ElementRef<HTMLCanvasElement>;

  sleepChart: Chart | null = null;
  sleepinessChart: Chart | null = null;
  sleepinessChartDateLabel: string = '';

  constructor(
    public sleepService: SleepService,
    private alertCtrl: AlertController
  ) {}

  ngAfterViewInit() {
    this.renderSleepChart();
    this.renderSleepinessChart();
  }

  ionViewWillEnter() {
    this.renderSleepChart();
    this.renderSleepinessChart();
  }

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

  get hasSleepinessChartData(): boolean {
    return this.getLatestSleepinessDayEntries().length > 0;
  }

  private renderSleepChart() {
    if (!this.sleepChartCanvas?.nativeElement) return;

    const recentSleep = this.allOvernightData.slice(-7);

    const labels = recentSleep.map(entry =>
      entry.getSleepStart().toLocaleDateString(undefined, { weekday: 'short' })
    );

    const durations = recentSleep.map(entry => {
      const ms = entry.getSleepEnd().getTime() - entry.getSleepStart().getTime();
      return +(ms / (1000 * 60 * 60)).toFixed(2);
    });

    if (this.sleepChart) {
      this.sleepChart.destroy();
    }

    this.sleepChart = new Chart(this.sleepChartCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Hours Slept',
            data: durations,
            backgroundColor: 'rgba(24, 66, 33, 0.75)',
            borderColor: 'rgba(24, 66, 33, 1)',
            borderWidth: 1,
            borderRadius: 8
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: '#333'
            }
          }
        },
        scales: {
          x: {
            ticks: {
              color: '#333',
              maxRotation: 0,
              minRotation: 0
            },
            grid: {
              display: false
            }
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: '#333'
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.08)'
            },
            title: {
              display: true,
              text: 'Hours',
              color: '#333'
            }
          }
        }
      }
    });
  }

  private getLatestSleepinessDayEntries(): StanfordSleepinessData[] {
    if (this.allSleepinessData.length === 0) return [];

    const sorted = [...this.allSleepinessData].sort(
      (a, b) => a.loggedAt.getTime() - b.loggedAt.getTime()
    );

    const latest = sorted[sorted.length - 1].loggedAt;

    const year = latest.getFullYear();
    const month = latest.getMonth();
    const day = latest.getDate();

    return sorted.filter(entry => {
      const d = entry.loggedAt;
      return (
        d.getFullYear() === year &&
        d.getMonth() === month &&
        d.getDate() === day
      );
    });
  }

  private renderSleepinessChart() {
    if (!this.sleepinessChartCanvas?.nativeElement) return;

    const entries = this.getLatestSleepinessDayEntries();

    if (entries.length === 0) {
      this.sleepinessChartDateLabel = '';
      if (this.sleepinessChart) {
        this.sleepinessChart.destroy();
        this.sleepinessChart = null;
      }
      return;
    }

    const latestDate = entries[0].loggedAt;
    this.sleepinessChartDateLabel = latestDate.toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    });

    const labels = entries.map(entry =>
      entry.loggedAt.toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit'
      })
    );

    const values = entries.map(entry => entry.getLoggedValue());

    if (this.sleepinessChart) {
      this.sleepinessChart.destroy();
    }

    this.sleepinessChart = new Chart(this.sleepinessChartCanvas.nativeElement, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Sleepiness Level',
            data: values,
            borderColor: 'rgba(24, 66, 33, 1)',
            backgroundColor: 'rgba(24, 66, 33, 0.2)',
            pointBackgroundColor: 'rgba(24, 66, 33, 1)',
            pointBorderColor: 'rgba(24, 66, 33, 1)',
            pointRadius: 5,
            pointHoverRadius: 6,
            tension: 0.3,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: '#333'
            }
          }
        },
        scales: {
          x: {
            ticks: {
              color: '#333'
            },
            grid: {
              display: false
            }
          },
          y: {
            min: 1,
            max: 7,
            ticks: {
              stepSize: 1,
              color: '#333'
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.08)'
            },
            title: {
              display: true,
              text: 'Sleepiness',
              color: '#333'
            }
          }
        }
      }
    });
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

    this.renderSleepChart();
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

    this.renderSleepinessChart();
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
    this.renderSleepChart();
    this.renderSleepinessChart();
  }
}
