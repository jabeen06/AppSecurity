import { app } from './app.js';
import { env } from './config/env.js';
import { connectDatabase } from './db/connection.js';

await connectDatabase();

app.listen(env.port, () => {
  console.log(`Oratory Guild backend listening on port ${env.port}`);
});
