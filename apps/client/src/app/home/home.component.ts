import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { DialogModule } from 'primeng/dialog';
import { TabMenuModule } from 'primeng/tabmenu';
import { MenuItem } from 'primeng/api';

import { JokeListComponent } from '../joke-list/joke-list.component';
import { RandomJokeComponent } from '../random-joke/random-joke.component';
import { JokeAddComponent } from '../joke-add/joke-add.component';

type ViewOption = 'list' | 'random';

@Component({
  selector: 'corp-home',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    TabViewModule,
    DialogModule,
    TabMenuModule,
    JokeListComponent,
    RandomJokeComponent,
    JokeAddComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  activeIndex = 0;
  viewOption: ViewOption = 'list';
  visible = false;
  menuItems: MenuItem[] = [
    {
      label: 'Joke List',
      id: 'list',
    },
    {
      label: 'Random Joke',
      id: 'random',
    },
  ];
  activeMenuItem = this.menuItems[0];

  onActiveMenuItemChange(event: MenuItem) {
    this.activeMenuItem = event;
    this.viewOption = event.id as ViewOption;
  }
}
