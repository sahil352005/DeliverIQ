import { registerAs } from '@nestjs/config';

export const redisConfig = registerAs('redis', () => ({
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT || 6379),
  db: Number(process.env.REDIS_DB || 0),
}));


