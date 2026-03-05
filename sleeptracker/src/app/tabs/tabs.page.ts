import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { moonOutline, cloudOutline, listOutline } from 'ionicons/icons';

/* icons for tabs */
addIcons({
  moonOutline,
  cloudOutline,
  listOutline
});

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
    IonIcon
  ],
})
export class TabsPage {}