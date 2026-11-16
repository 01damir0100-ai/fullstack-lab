import { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ProductCard from './components/ProductCard';
import ContactForm from './components/ContactForm';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

function App() {
  // ===== Логика из лабораторной 3 (без изменений; подставьте свою, если она отличается) =====
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    fetch(`${API}/products`)
      .then((res) => res.json())
      .then(setProducts);
  }, []);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  function handleAddToCart() {
    setCartCount((c) => c + 1);
  }
  // ==========================================================================================

  return (
    <>
      <Header cartCount={cartCount} />

      <main className="page">
        <section id="catalog" className="catalog">
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
