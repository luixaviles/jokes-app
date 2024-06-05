import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { DropdownModule } from 'primeng/dropdown';

import { JokeRowComponent } from '../joke-row/joke-row.component';
import { SortByOption } from '../model/sort-by-option';
import { JokesService } from '../services/jokes.service';
import { map, tap } from 'rxjs';

@Component({
  selector: 'corp-joke-list',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    PaginatorModule,
    DropdownModule,
    JokeRowComponent,
  ],
  templateUrl: './joke-list.component.html',
  styleUrl: './joke-list.component.scss',
})
export class JokeListComponent {
  readonly sortByOptions = ['Type', 'Setup'];
  readonly pageSizeOptions = [10, 20, 30];

  readonly sortByOption = signal<SortByOption>('Type');
  readonly pageSizeOption = signal<number>(this.pageSizeOptions[0]);
  readonly jokeTotalRecords = signal<number>(0);
  readonly currentPage = signal<number>(1);

  readonly jokeService = inject(JokesService);
  readonly jokeList = computed(() => {
    return this.jokeService
      .getJokes(this.sortByOption(), this.pageSizeOption(), this.currentPage())
      .pipe(
        tap((jokesResponse) => {
          this.jokeTotalRecords.set(jokesResponse.totalRecords);
        }),
        map((jokesResponse) => jokesResponse.jokes)
      );
  });

  onPageChange(event: PaginatorState) {
    let {page} = event as Required<PaginatorState>;
    this.currentPage.set(++page);
  }
}
