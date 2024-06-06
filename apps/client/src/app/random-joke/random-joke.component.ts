import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

import { ButtonModule } from 'primeng/button';
import { JokeRowComponent } from '../joke-row/joke-row.component';
import { JokesService } from '../services/jokes.service';
import { Joke } from '../model/joke.interface';
import { BehaviorSubject, merge } from 'rxjs';
import { SpeechSynthesizerService } from '../services/speech-synthesizer.service';

import '@joke-item/joke-item';
import { getJokeFromEvent } from '../services/utils';

@Component({
  selector: 'corp-random-joke',
  standalone: true,
  imports: [CommonModule, ButtonModule, JokeRowComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './random-joke.component.html',
  styleUrl: './random-joke.component.scss',
})
export class RandomJokeComponent {
  readonly jokeService = inject(JokesService);
  readonly speechSynthesizerService = inject(SpeechSynthesizerService);
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

  listen(event: Event) {
    const joke = getJokeFromEvent(event);
    this.speechSynthesizerService.tellJoke(joke);
  }
  edit(event: Event) {
    const joke = (event as CustomEvent<Joke>).detail;
    console.log('edit', joke);
  }
  remove(event: Event) {
    const joke = (event as CustomEvent<Joke>).detail;
    console.log('remove', joke);
  }
}
