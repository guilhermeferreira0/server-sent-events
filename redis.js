import { RedisClient } from 'redis';

class Redis {
  static instance;

  constructor() {}

  static getInstance() {
    if (!Redis.instance) {
      Redis.instance = new RedisClient({
        url: process.env.REDIS_HOST,
      });

      Redis.instance.on('error', (error) => {
        console.error('[Redis Error]', error);
      });
    }

    return Redis.instance;
  }

  static async connect() {
    const client = this.getInstance();

    if (!client.isOpen) {
      await client.connect();
    }

    return client;
  }
}

export default Redis;