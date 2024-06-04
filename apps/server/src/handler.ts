import {jokes} from './jokes/jokes';

interface Joke {
  id: number;
  type: string;
  setup: string;
  punchline: string;
}

let lastJokeId = 0;
jokes.forEach((jk: Joke) => jk.id = ++lastJokeId); 

const randomJoke = () => {
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

const randomTen = () => randomN(jokes as Joke[], 10);

const randomSelect = (number: number) => randomN(jokes as Joke[], number);

const jokeByType = (type: string, n: number) => {
  return randomN(jokes.filter((joke: Joke) => joke.type === type) as Joke[], n);
};

const jokeById = (id: number) => (jokes.filter((jk: Joke) => jk.id === id)[0]);

export { jokes, randomJoke, randomN, randomTen, randomSelect, jokeById, jokeByType };
