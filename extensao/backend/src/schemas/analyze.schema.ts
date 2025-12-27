import { z } from 'zod';

export const analyzeBodySchema = z.object({
  leadMessage: z.string().min(1),
  sellerLastMessage: z.string().optional(),
  channel: z.literal('whatsapp-web'),
  language: z.string().default('pt-BR')
});

export const analyzeSchema = {
  body: analyzeBodySchema
};
