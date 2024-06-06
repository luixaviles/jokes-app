import { Joke } from '../model/joke.interface';

export function getJokeFromEvent(event: Event): Joke {
    return (event as CustomEvent<Joke[]>).detail[0];
}