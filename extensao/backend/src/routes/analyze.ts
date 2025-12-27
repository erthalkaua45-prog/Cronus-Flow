import { FastifyInstance } from 'fastify';
import { analyzeSchema } from '../schemas/analyze.schema.js';
import { analyzeMessage } from '../services/ai.service.js';

export async function analyzeRoute(app: FastifyInstance) {
  app.post('/analyze', { schema: analyzeSchema }, async (request, reply) => {
    const body = request.body as any;

    const result = await analyzeMessage(body);

    return reply.send(result);
  });
}
