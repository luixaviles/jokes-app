import express from 'express';
import LimitingMiddleware from 'limiting-middleware';
import {
  randomJoke,
  randomTen,
  randomSelect,
  jokeByType,
  jokeById,
  jokes,
} from './handler';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();

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
    const count = Object.keys(jokes).length;

    if (num > Object.keys(jokes).length) {
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
  const pageSize = 10;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const totalJokes = Object.keys(jokes).length;

  if (startIndex >= totalJokes) {
    res.send('Page not found');
  } else {
    let jokesPerPage = Object.values(jokes).slice(startIndex, endIndex);

    const sortBy = req.query.sortBy as string;
    if (sortBy === 'type') {
      jokesPerPage = jokesPerPage.sort((a, b) => a.type.localeCompare(b.type));
    } else if (sortBy === 'setup') {
      jokesPerPage = jokesPerPage.sort((a, b) =>
        a.setup.localeCompare(b.setup)
      );
    }

    res.json({
      jokes: jokesPerPage,
      currentPage: page,
      totalPages: Math.ceil(totalJokes / pageSize),
    });
  }
});

app.delete('/jokes/:id', (req, res, next) => {
  try {
    const { id } = req.params;
    const joke = jokeById(+id);
    if (!joke) return next({ statusCode: 404, message: 'joke not found' });
    delete jokes[id];
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

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    type: 'error',
    message: err.message,
  });
});

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
