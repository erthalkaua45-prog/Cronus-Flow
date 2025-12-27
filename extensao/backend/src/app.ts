import Fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import Redis from 'ioredis';
import { analyzeRoute } from './routes/analyze.js';

export function buildApp() {
  const app = Fastify({ logger: true });

  app.register(cors, { origin: true });

  const redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD
  });

  app.register(rateLimit, {
    redis,
    max: 30,
    timeWindow: '1 hour',
    keyGenerator: (req) => {
      return req.headers['authorization'] || req.ip;
    },
    errorResponseBuilder: () => {
      return {
        error: 'RATE_LIMIT_EXCEEDED',
        message: 'Limite de uso atingido. Tente novamente mais tarde.'
      };
    }
  });

  app.register(analyzeRoute, { prefix: '/v1' });

  return app;
}
