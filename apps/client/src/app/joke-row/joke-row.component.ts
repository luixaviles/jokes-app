import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { Joke } from '../model/joke.interface';

@Component({
  selector: 'corp-joke-row',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule, TagModule, DividerModule],
  templateUrl: './joke-row.component.html',
  styleUrl: './joke-row.component.scss',
})
export class JokeRowComponent {
  _joke: Joke | undefined;

  @Input() set joke(joke: Joke | undefined) {
    this._joke = joke;
  }

  get joke(): Joke | undefined {
    return this._joke;
  }
  
}
