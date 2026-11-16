Часть 8 (agromarket-react). Ветка: git switch -c feature/env-config
  src/api.js          -> заменить
  .env.development    -> НОВЫЙ, лежит в КОРНЕ проекта (рядом с package.json), коммитить можно
Дальше: npm run build, git add ., git commit -m "feat: read API_URL from VITE_API_URL", git push -u origin feature/env-config
После изменения .env-файлов перезапускайте npm run dev.
