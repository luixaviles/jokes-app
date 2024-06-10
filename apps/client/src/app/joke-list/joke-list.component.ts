import { Component, computed, inject, signal, CUSTOM_ELEMENTS_SCHEMA, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Paginator, PaginatorModule, PaginatorState } from 'primeng/paginator';
import { DropdownModule } from 'primeng/dropdown';
import { SkeletonModule } from 'primeng/skeleton';


import { JokeRowComponent } from '../joke-row/joke-row.component';
import { SortByOption } from '../model/sort-by-option';
import { JokesService } from '../services/jokes.service';
import { map, tap } from 'rxjs';

import '@joke-item/joke-item';
import { Joke } from '../model/joke.interface';
import { LoadingState } from '../model/loading-state';
import { toObservable } from '@angular/core/rxjs-interop';

@Component({
  selector: 'corp-joke-list',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    PaginatorModule,
    DropdownModule,
    SkeletonModule,
    JokeRowComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './joke-list.component.html',
  styleUrl: './joke-list.component.scss',
})
export class JokeListComponent {
  readonly sortByOptions = ['Type', 'Setup', 'Id'];
  readonly pageSizeOptions = [10, 20, 30];

  readonly sortByOption = signal<SortByOption>('Type');
  readonly pageSizeOption = signal<number>(this.pageSizeOptions[0]);
  readonly pageSizeOption$ = toObservable(this.pageSizeOption);
  
  readonly jokeTotalRecords = signal<number>(0);
  readonly currentPage = signal<number>(1);
  readonly deletedJoke = signal<number | undefined>(undefined);
  readonly paginator = viewChild.required<Paginator>('paginator');

  readonly jokeService = inject(JokesService);
  readonly jokeList = computed(() => {
    this.loadingState = 'loading';
    this.deletedJoke();

    return this.jokeService
      .getJokes(this.sortByOption(), this.pageSizeOption(), this.currentPage())
      .pipe(
        tap((jokesResponse) => {
          this.jokeTotalRecords.set(jokesResponse.totalRecords);
        }),
        map((jokesResponse) => jokesResponse.jokes),
        tap(() => {
          this.loadingState = 'success';
        })
      );
  });


  skeletonList = signal(Array(10).fill(''));
  loadingState: LoadingState = 'loading';

  constructor() {
    this.pageSizeOption$.pipe(
      tap(() => {
        this.paginator().changePage(0);
      })
    ).subscribe();
  }

  onPageChange(event: PaginatorState) {
    let {page} = event as Required<PaginatorState>;
    this.currentPage.set(++page);
  }

  removeConfirmed(joke: Joke): void {
    this.deletedJoke.set(joke.id);
  }
}
