import { Injectable } from '@angular/core';
import { Joke } from '../model/joke.interface';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { SortByOption } from '../model/sort-by-option';
import { JokesResponse } from '../model/jokes-response';

const apiHost = environment.apiHost;

@Injectable({
  providedIn: 'root',
})
export class JokesService {
  constructor(private http: HttpClient) {}

  getRandomJoke(): Observable<Joke> {
    return this.http.get<Joke>(`${apiHost}/random_joke`);
  }

  getJokes(sortBy: SortByOption, pageSize: number, page = 1): Observable<JokesResponse> {
    return this.http
      .get<JokesResponse>(`${apiHost}/jokes`, {
        params: {
          sortBy,
          pageSize,
          page
        },
      }).pipe(
        catchError(() => {
          return [];
        })
      );
  }

  removeJoke(jokeId: number): Observable<string> {
    return this.http.delete<string>(`${apiHost}/jokes/${jokeId}`);
  }

  addJoke(joke: Joke): Observable<Joke> {
    return this.http.post<Joke>(`${apiHost}/joke`, joke);
  }

  generateJoke(): Observable<Joke> {
    return this.http.get<Joke>(`${apiHost}/ai/joke`);
  }
}
