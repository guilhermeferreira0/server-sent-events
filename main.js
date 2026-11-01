import express from 'express';
import cors from 'cors';
import Redis from './redis.js';

const port = 8080;

const app = express();
app.use(cors());

app.get('/events', async (req, res) => {
  res.header('Content-Type', 'text/event-stream');
  res.header('Cache-Control', 'no-cache');
  res.header('Connection', 'keep-alive');
  res.header('Access-Control-Allow-Origin', '*');

  const redisClient = Redis.getInstance().duplicate();
  await redisClient.connect();
  await redisClient.subscribe('notifications', (message) => {
    res.write(
      'event: ' + 'notification\n' +
      'data: ' + message + '\n\n'
    );
  });

  req.on('close', () => {
    redisClient.unsubscribe('notifications');
    res.end();
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
