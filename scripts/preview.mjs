import path from 'node:path';
import { startServer } from './static-server.mjs';

startServer({ root: path.resolve('dist'), port: Number(process.env.PORT ?? 4173) });
