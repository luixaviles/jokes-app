import { Joke } from './jokes/joke.interface';
import {readJokes} from './jokes/jokes';

const randomJoke = () => {
  const jokes = readJokes();
  return jokes[Math.floor(Math.random() * jokes.length)];
}

/**
 * Get N random jokes from a jokeArray
 */
const randomN = (jokeArray: Joke[], n: number) => {
  const limit = jokeArray.length < n ? jokeArray.length : n;
  const randomIndicesSet = new Set();

  while (randomIndicesSet.size < limit) {
    const randomIndex = Math.floor(Math.random() * jokeArray.length);
    if (!randomIndicesSet.has(randomIndex)) {
      randomIndicesSet.add(randomIndex);
    }
  }

  return Array.from(randomIndicesSet).map((randomIndex: number) => {
    return jokeArray[randomIndex];
  });
};

const randomTen = () => randomN(readJokes(), 10);

const randomSelect = (number: number) => randomN(readJokes(), number);

const jokeByType = (type: string, n: number) => {
  return randomN(readJokes().filter((joke: Joke) => joke.type === type) as Joke[], n);
};

const jokeById = (id: number) => (readJokes().filter((jk: Joke) => jk.id === id)[0]);

export { randomJoke, randomN, randomTen, randomSelect, jokeById, jokeByType };
