import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { SkeletonModule } from 'primeng/skeleton';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { JokesService } from '../services/jokes.service';
import { BehaviorSubject, catchError, merge, tap } from 'rxjs';

import { Joke } from '../model/joke.interface';
import { LoadingState } from '../model/loading-state';

@Component({
  selector: 'corp-joke-add',
  standalone: true,
  imports: [CommonModule, ButtonModule, InputTextModule, CardModule, SkeletonModule, ToastModule],
  providers: [MessageService],
  templateUrl: './joke-add.component.html',
  styleUrl: './joke-add.component.scss',
})
export class JokeAddComponent {
  readonly jokeService = inject(JokesService);
  readonly messageService = inject(MessageService);

  @Output()
  cancel = new EventEmitter<void>();


  readonly joke$ = this.jokeService.generateJoke().pipe(
    tap(() => {
      this.loadingState = 'success';
    }),
    catchError((error) => {
      this.loadingState = 'error';
      throw error;
    })
  );
  readonly newJoke = new BehaviorSubject<Joke | undefined>(undefined);
  readonly newJoke$ = this.newJoke.asObservable();
  readonly joke = toSignal<Joke | undefined>(merge(this.joke$, this.newJoke$));
  loadingState: LoadingState = 'loading';


  generateNewJoke() {
    this.loadingState = 'loading';
    this.joke$.pipe(
      catchError((error) => {
        this.loadingState = 'error';
        throw error;
      })
    ).subscribe((newJoke) => {
      this.newJoke.next(newJoke);
    });
  }

  save() {
    this.jokeService.addJoke(this.joke() as Joke).subscribe((j) => {
      this.messageService.add({
        severity: 'info',
        summary: 'Confirmed',
        detail: 'Joke has been added. Generating a new one...',
      });
      this.generateNewJoke();
    });
  }

  cancelAction() {
    this.cancel.emit();
  }
}
