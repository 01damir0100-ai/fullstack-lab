import { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ProductCard from './components/ProductCard';
import ContactForm from './components/ContactForm';
import LoginForm from './components/LoginForm';
import AddProductForm from './components/AddProductForm';
import { apiFetch } from './api.js';
import './auth.css';

// Пользователь из localStorage (если там мусор — считаем, что не входили)
function readSavedUser() {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null');
  } catch {
    return null;
  }
}

function App() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(readSavedUser); // ленивая инициализация

  // Каталог
  useEffect(() => {
    apiFetch('/products').then(setProducts).catch(() => {});
  }, []);

  // Проверяем сохранённый токен при открытии страницы
  useEffect(() => {
    if (!localStorage.getItem('token')) return; // не входили — проверять нечего
    apiFetch('/auth/me')
      .then(setUser)
      .catch(() => {}); // при 401 apiFetch сам выполнит выход
  }, []);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  function handleAddToCart() {
    setCartCount((c) => c + 1);
  }

  function handleLogin(user, token) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
  }

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }

  return (
    <>
      <div className="auth-bar">
        {user ? (
          <>
            <span>Вы вошли как <b>{user.name}</b> ({user.role})</span>
            <button onClick={handleLogout}>Выйти</button>
          </>
        ) : (
          <LoginForm onLogin={handleLogin} />
        )}
      </div>

      <Header cartCount={cartCount} />

      <main className="page">
        <section id="catalog" className="catalog">
          {user?.role === 'admin' && (
            <AddProductForm onAdded={(p) => setProducts([...products, p])} />
          )}

          <div className="catalog-toolbar">
            <h2>Каталог</h2>
            <input
              type="search"
              placeholder="Поиск товаров..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="product-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAdd={handleAddToCart}
                featured={product.id === 1}
              />
            ))}
          </div>
        </section>

        <aside id="delivery" className="sidebar">
          <h3>Доставка</h3>
          <ul>
            <li>Астана — на следующий день</li>
            <li>Акмолинская область — 2–3 дня</li>
            <li>Бесплатно от 20 000 тг</li>
          </ul>
        </aside>

        <ContactForm products={products} />
      </main>

      <Footer />
    </>
  );
}

export default App;
