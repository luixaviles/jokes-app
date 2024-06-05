import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { DividerModule } from 'primeng/divider';
import { JokeListComponent } from '../joke-list/joke-list.component';
import { RandomJokeComponent } from '../random-joke/random-joke.component';

type ViewOption = 'list' | 'random';

@Component({
  selector: 'corp-home',
  standalone: true,
  imports: [CommonModule, ButtonModule, TabViewModule, DividerModule, JokeListComponent, RandomJokeComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  activeIndex = 0;

  viewOption: ViewOption = 'list';
}
