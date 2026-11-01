import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useInventory } from './InventoryContext';

const emptyForm = { name: '', brand: '', category: '', unit: '', price: '', stock: '' };

export default function AddProduct() {
  const { addProduct } = useInventory();
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  function change(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    setMessage('');
    setError('');
  }

  function submit(event) {
    event.preventDefault();
    const product = Object.fromEntries(Object.entries(form).map(([key, value]) => [key, value.trim()]));
    if (Object.values(product).some((value) => !value)) {
      setError('Completa todos los campos con datos válidos.');
      return;
    }
    const price = Number(product.price);
    const stock = Number(product.stock);
    if (!Number.isSafeInteger(price) || price < 0 || !Number.isSafeInteger(stock) || stock < 0) {
      setError('El precio y el stock deben ser números enteros mayores o iguales a cero.');
      return;
    }
    addProduct({ ...product, price, stock });
    setMessage(`${product.name} se agregó al inventario.`);
    setError('');
    setForm(emptyForm);
  }

  return <section className="content-page">
    <p className="eyebrow">GESTIÓN DEL SUPERMERCADO</p>
    <h1>Agregar <span>artículo.</span></h1>
    <p className="intro">Registra un producto para verlo en el inventario. Los datos se conservan mientras navegas por el sitio durante esta sesión.</p>
    <form onSubmit={submit} className="grid grid-cols-1 gap-5 rounded-2xl border border-[#dce4d7] bg-white p-6 sm:grid-cols-2 sm:p-8">
      <label className="grid gap-2 text-sm font-semibold">Nombre<input name="name" required maxLength={100} value={form.name} onChange={change} autoComplete="off" /></label>
      <label className="grid gap-2 text-sm font-semibold">Marca<input name="brand" required maxLength={80} value={form.brand} onChange={change} autoComplete="off" /></label>
      <label className="grid gap-2 text-sm font-semibold">Tipo de producto<input name="category" required maxLength={80} list="product-types" value={form.category} onChange={change} /><datalist id="product-types">{['Frutas y verduras', 'Lácteos', 'Abarrotes', 'Panadería', 'Bebidas', 'Limpieza'].map((type) => <option key={type} value={type} />)}</datalist></label>
      <label className="grid gap-2 text-sm font-semibold">Presentación<input name="unit" required maxLength={40} placeholder="Ej.: 1 kg, 500 g o 1 L" value={form.unit} onChange={change} /></label>
      <label className="grid gap-2 text-sm font-semibold">Precio en pesos chilenos<input name="price" type="number" min="0" max="9007199254740991" step="1" required value={form.price} onChange={change} /></label>
      <label className="grid gap-2 text-sm font-semibold">Stock en unidades<input name="stock" type="number" min="0" max="9007199254740991" step="1" required value={form.stock} onChange={change} /></label>
      <div className="flex flex-wrap items-center gap-4 sm:col-span-2"><button className="button cursor-pointer border-0" type="submit">Guardar artículo</button><Link to="/inventario" className="text-sm font-semibold underline underline-offset-4">Ver inventario</Link></div>
      <p role="status" className="m-0 text-sm text-green-800 sm:col-span-2">{message}</p>
      {error && <p role="alert" className="m-0 text-sm text-red-800 sm:col-span-2">{error}</p>}
    </form>
  </section>;
}
