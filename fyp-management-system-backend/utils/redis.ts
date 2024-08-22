import { Redis } from 'ioredis';
require('dotenv').config();

const redisClients = () => {
  const redisUrl = process.env.REDIS_URL;
  if (redisUrl) {
    console.log('Redis URL found:', redisUrl);
    return redisUrl;
  } else {
    throw new Error('Redis URL not found in environment variables');
  }
};

export const redis = new Redis(redisClients());

redis.on('connect', () => {
  console.log('Connected to Redis...');
});

redis.on('error', (err) => {
  console.error('Redis connection error:', err);
});
