import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

import { ButtonModule } from 'primeng/button';

import { JokeRowComponent } from '../joke-row/joke-row.component';
import { JokesService } from '../services/jokes.service';
import { Joke } from '../model/joke.interface';
import { BehaviorSubject, merge } from 'rxjs';

import '@joke-item/joke-item';

@Component({
  selector: 'corp-random-joke',
  standalone: true,
  imports: [CommonModule, ButtonModule, JokeRowComponent],
  templateUrl: './random-joke.component.html',
  styleUrl: './random-joke.component.scss',
})
export class RandomJokeComponent {
  readonly jokeService = inject(JokesService);

  readonly joke$ = this.jokeService.getRandomJoke();
  readonly randomJoke = new BehaviorSubject<Joke | undefined>(undefined);
  readonly randomJoke$ = this.randomJoke.asObservable();
  readonly joke = toSignal<Joke | undefined>(
    merge(this.joke$, this.randomJoke$)
  );

  generateRandomJoke() {
    this.joke$.subscribe((newJoke) => {
      this.randomJoke.next(newJoke);
    });
  }

  removeConfirmed() {
    this.generateRandomJoke();
  }
}
