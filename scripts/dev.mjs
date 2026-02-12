import path from 'node:path';
import { startServer } from './static-server.mjs';

startServer({ root: path.resolve('src'), port: Number(process.env.PORT ?? 5173) });
