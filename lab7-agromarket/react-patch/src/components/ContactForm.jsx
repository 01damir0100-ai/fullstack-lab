import { useState } from 'react';
import { apiFetch } from '../api.js';

function ContactForm({ products = [] }) {
  const [errors, setErrors] = useState([]);
  const [sending, setSending] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();               // не перезагружать страницу
    const form = e.target;
    const data = new FormData(form);
    setErrors([]);
    setSending(true);

    try {
      // заявку может оставить любой посетитель: токен не обязателен
      const order = await apiFetch('/orders', {
        method: 'POST',
        body: JSON.stringify({
          product_id: data.get('product_id') || null,
          name: data.get('name'),
          email: data.get('email'),
          phone: data.get('phone'),
          quantity: Number(data.get('volume')),
          date: data.get('date'),
          comment: data.get('comment'),
        }),
      });
      alert(`Заявка №${order.id} отправлена! Мы свяжемся с вами.`);
      form.reset();                   // очистить поля
    } catch (err) {
      setErrors([err.message]);
    } finally {
      setSending(false);
    }
  }

  return (
    <section id="contact" className="contact">
      <h2>Оптовая заявка</h2>

      <form className="contact-form" onSubmit={handleSubmit}>
        <label htmlFor="product_id">Товар</label>
        <select id="product_id" name="product_id" defaultValue="">
          <option value="">— не выбран —</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        <label htmlFor="name">Имя / организация</label>
        <input id="name" name="name" type="text" required />

        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required
               placeholder="farmer@mail.kz" />

        <label htmlFor="phone">Телефон</label>
        <input id="phone" name="phone" type="tel"
               placeholder="+7 7XX XXX XX XX" />

        <label htmlFor="volume">Объём заказа, кг</label>
        <input id="volume" name="volume" type="number" min="10" required />

        <label htmlFor="date">Желаемая дата доставки</label>
        <input id="date" name="date" type="date" />

        <label htmlFor="comment">Комментарий</label>
        <textarea id="comment" name="comment" rows="4" />

        {errors.length > 0 && (
          <ul className="form-errors">
            {errors.map((m) => <li key={m}>{m}</li>)}
          </ul>
        )}

        <button type="submit" disabled={sending}>
          {sending ? 'Отправка...' : 'Отправить заявку'}
        </button>
      </form>
    </section>
  );
}

export default ContactForm;
