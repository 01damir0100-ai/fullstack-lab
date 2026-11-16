agromarket-react, ЛР9.
1) Ветка feature/vercel: положите vercel.json в КОРЕНЬ проекта (рядом с package.json).
   Коммит: chore: SPA rewrites for Vercel. Затем PR -> Approve -> merge.
2) Vercel: Import agromarket-react, Framework Vite, Build npm run build, Output dist,
   переменная VITE_API_URL = https://agromarket-api-ЛОГИН.onrender.com/api
3) Ветка feature/ci: положите .github/workflows/ci.yml. Коммит: ci: build check.
   В этом CI нет шага lint: в вашем package.json скрипта lint нет.

ВАЖНО: в package.json React-проекта должны быть скрипты build и preview.
Если их нет (раньше были только dev и server), добавьте в "scripts":
    "build": "vite build",
    "preview": "vite preview"
Без "build" не работают ни npm run build, ни CI, ни Vercel.
