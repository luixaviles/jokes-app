import { Joke } from './joke.interface';

export interface JokesResponse {
    currentPage: number;
    jokes: Joke[];
    totalPages: number;
    totalRecords: number;
}