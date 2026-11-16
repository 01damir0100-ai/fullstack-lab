import 'dotenv/config'; // по-прежнему первая строка
import app from './app.js';

// Без секретного ключа сервер работать не должен — лучше упасть сразу и явно
if (!process.env.JWT_SECRET) {
  console.error('Не задан JWT_SECRET в .env');
  process.exit(1);
}

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`АгроМаркет API: http://localhost:${PORT}`);
});
