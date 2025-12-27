import { buildApp } from './app.js';

const app = buildApp();

const PORT = Number(process.env.PORT) || 3000;

app.listen({ port: PORT, host: '0.0.0.0' })
  .then(() => {
    console.log(`🚀 API running on port ${PORT}`);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
