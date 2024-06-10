import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import LimitingMiddleware from 'limiting-middleware';
import {
  randomJoke,
  randomTen,
  randomSelect,
  jokeByType,
  jokeById,
} from './handler';
import { deleteJoke, readJokes, saveJoke } from './jokes/jokes';
import { Joke } from './jokes/joke.interface';
import { GoogleGenerativeAI } from '@google/generative-ai';

const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const genModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(new LimitingMiddleware().limitByIp());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/', (req, res) => {
  res.send('Try /random_joke, /random_ten, /jokes/random, or /jokes/ten');
});

app.get('/ping', (req, res) => {
  res.send('pong');
});

app.get('/random_joke', (req, res) => {
  res.json(randomJoke());
});

app.get('/random_ten', (req, res) => {
  res.json(randomTen());
});

app.get('/jokes/random', (req, res) => {
  res.json(randomJoke());
});

// TODO: Needs fixing
app.get('/jokes/random(/*)?', (req, res) => {
  let num;

  try {
    num = parseInt(req.path.substring(14, req.path.length));
  } catch (err) {
    res.send('The passed path is not a number.');
  } finally {
    const count = Object.keys(readJokes()).length;

    if (num > Object.keys(readJokes()).length) {
      res.send(`The passed path exceeds the number of jokes (${count}).`);
    } else {
      res.json(randomSelect(num));
    }
  }
});

app.get('/jokes/ten', (req, res) => {
  res.json(randomTen());
});

app.get('/jokes/:type/random', (req, res) => {
  res.json(jokeByType(req.params.type, 1));
});

app.get('/jokes/:type/ten', (req, res) => {
  res.json(jokeByType(req.params.type, 10));
});

app.get('/jokes/:id', (req, res, next) => {
  try {
    const { id } = req.params;
    const joke = jokeById(+id);
    if (!joke) return next({ statusCode: 404, message: 'joke not found' });
    return res.json(joke);
  } catch (e) {
    return next(e);
  }
});

app.get('/jokes', (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 10;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const jokes = readJokes();
  const totalJokes = Object.keys(jokes).length;

  const sortBy = (req.query.sortBy as string).toLowerCase();

  if (startIndex >= totalJokes) {
    res.send(404).send('Page not found');
  } else {
    let jokesList = jokes;
    // sorting
    if (sortBy === 'type') {
      jokesList = jokesList.sort((a, b) => a.type.localeCompare(b.type));
    } else if (sortBy === 'setup') {
      jokesList = jokesList.sort((a, b) => a.setup.localeCompare(b.setup));
    } else if(sortBy === 'id') {
      jokesList = jokesList.sort((a, b) => a.id - b.id);
    }

    const jokesPerPage = Object.values(jokesList).slice(startIndex, endIndex);

    res.json({
      jokes: jokesPerPage,
      currentPage: page,
      totalPages: Math.ceil(totalJokes / pageSize),
      totalRecords: jokes.length,
    });
  }
});

app.delete('/jokes/:id', (req, res, next) => {
  try {
    const { id } = req.params;
    const joke = jokeById(+id);
    if (!joke) return next({ statusCode: 404, message: 'joke not found' });

    deleteJoke(id);

    res.json({ message: 'joke deleted successfully' });
  } catch (e) {
    return next(e);
  }
});

app.put('/jokes/:id', (req, res, next) => {
  try {
    const { id } = req.params;
    const joke = jokeById(+id);
    if (!joke) return next({ statusCode: 404, message: 'joke not found' });
    const { setup, punchline } = req.body;
    joke.setup = setup;
    joke.punchline = punchline;
    res.json(joke);
  } catch (e) {
    return next(e);
  }
});

app.post('/joke', (req, res, next) => {
  const { setup, punchline, type } = req.body;
  const newJoke: Joke = {
    setup,
    punchline,
    type,
  };

  saveJoke(newJoke);
  res.json(newJoke);
});

app.get('/ai/joke', async (req, res, next) => {
  try {
    const jokes = readJokes();

    const prompt = `You're an expert writing jokes of the following types: 'programming' and 'knock-knock'.
    Generate a new joke following the provided examples and return a single JSON object with the provided structure. Return the JSON content only. 
    <examples>
    ${jokes}
    </examples>

    <structure>
    {
        "type": ""
        "setup": "",
        "punchline": ""
    }
    </structure>
    `;
    const result = await genModel.generateContent(prompt);
    const response = await result.response;
    const generatedJoke = response.text();
  
    res.json(JSON.parse(generatedJoke));
  } catch (e) {

    return next(e);
  }
});

app.listen(port, () => {
  console.log(`[ ready ] http://localhost:${port}`);
});
