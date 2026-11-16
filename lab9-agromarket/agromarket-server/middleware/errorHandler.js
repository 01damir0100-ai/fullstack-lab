// Коды ошибок PostgreSQL, которые означают «клиент прислал плохие данные»
const PG_CLIENT_ERRORS = {
  '22P02': 'Неверный формат значения',          // 'abc' вместо числа
  '23502': 'Не заполнено обязательное поле',    // NOT NULL
  '23503': 'Связанная запись не найдена',       // FOREIGN KEY
  '23514': 'Значение не проходит проверку в БД', // CHECK
};

// Обработчик ошибок Express — ровно 4 параметра, иначе Express его не узнает
export function errorHandler(err, req, res, next) {
  // 23505 — нарушение UNIQUE: такая запись уже есть (например, e-mail занят)
  if (err.code === '23505') {
    return res.status(409).json({ error: 'Такая запись уже существует' });
  }
  if (PG_CLIENT_ERRORS[err.code]) {
    return res.status(400).json({ error: PG_CLIENT_ERRORS[err.code], detail: err.message });
  }

  // Ошибки express.json(): тело больше лимита или битый JSON
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ error: 'Слишком большой запрос' });
  }
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Некорректный JSON в теле запроса' });
  }

  const status = err.status || err.statusCode || 500;

  // В лог — всё, что помогает разработчику (ошибки сервера, 5xx)
  if (status >= 500) {
    console.error(`[${req.method} ${req.originalUrl}]`, err);
  }

  const isProd = process.env.NODE_ENV === 'production';
  res.status(status).json({
    // наружу: для 5xx в продакшене — только общая фраза
    error: status >= 500 && isProd ? 'Внутренняя ошибка сервера' : err.message,
  });
}
