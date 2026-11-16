import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { pool } from './db/pool.js';
import { logger } from './middleware/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import authRouter from './routes/auth.js';
import productsRouter from './routes/products.js';
import ordersRouter from './routes/orders.js';

const app = express();

app.use(helmet()); // защитные HTTP-заголовки
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json({ limit: '10kb' })); // тело запроса не больше 10 КБ

// В тестах лог каждого запроса только мешает читать результат
if (process.env.NODE_ENV !== 'test') {
  app.use(logger);
}

// «Жив ли сервер и есть ли связь с базой?»
app.get('/api/health', async (req, res) => {
  await pool.query('SELECT 1');
  res.json({ status: 'ok', db: 'connected', time: new Date().toISOString() });
});

app.get('/api/about', (req, res) => {
  res.json({ name: 'АгроМаркет API', version: '1.0.0', city: 'Астана' });
});

app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);

app.use((req, res) => {
  res.status(404).json({ error: `Маршрут ${req.method} ${req.originalUrl} не найден` });
});

app.use(errorHandler); // обработчик ошибок — по-прежнему последним

export default app; // приложение БЕЗ запуска сервера
