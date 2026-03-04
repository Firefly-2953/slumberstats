import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonRouterOutlet,
  IonLabel,
  IonIcon
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  standalone: true,
  imports: [
    RouterLink,
    RouterOutlet,
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonRouterOutlet,
    IonLabel,
    IonIcon
  ],
})
export class TabsPage {}