import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, NavLink, Link, Route, Routes, useLocation } from 'react-router-dom';
import './styles.css';
import { InventoryProvider, useInventory } from './InventoryContext';
import AddProduct from './AddProduct';
import Icon from './Icon';

const initialProducts = [
  { id: 'FR-001', name: 'Manzana roja', brand: 'Huerta local', category: 'Frutas y verduras', unit: 'kg', price: 1690, stock: 48, icon: '🍎' },
  { id: 'FR-002', name: 'Palta Hass', brand: 'Huerta local', category: 'Frutas y verduras', unit: 'kg', price: 4990, stock: 8, icon: '🥑' },
  { id: 'LA-001', name: 'Leche entera', brand: 'Colun', category: 'Lácteos', unit: '1 L', price: 1190, stock: 36, icon: '🥛' },
  { id: 'LA-002', name: 'Queso gauda', brand: 'Soprole', category: 'Lácteos', unit: '250 g', price: 2990, stock: 0, icon: '🧀' },
  { id: 'AB-001', name: 'Arroz grado 1', brand: 'Tucapel', category: 'Abarrotes', unit: '1 kg', price: 1490, stock: 62, icon: '🍚' },
  { id: 'AB-002', name: 'Aceite de maravilla', brand: 'Chef', category: 'Abarrotes', unit: '1 L', price: 2390, stock: 9, icon: '🌻' },
  { id: 'PA-001', name: 'Pan de molde integral', brand: 'Ideal', category: 'Panadería', unit: '500 g', price: 2190, stock: 24, icon: '🍞' },
];
const money = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' });
const status = (stock) => stock === 0 ? 'Sin stock' : stock < 10 ? 'Stock bajo' : 'Disponible';

function InventorySummary() {
  const { products } = useInventory();
  return <section className="stats" aria-label="Resumen del inventario">
      <article><span>Productos registrados</span><strong>{products.length.toString().padStart(2, '0')}</strong></article>
      <article><span>Unidades en inventario</span><strong>{products.reduce((total, product) => total + product.stock, 0)}</strong></article>
      <article><span>Productos con stock bajo</span><strong>{products.filter((product) => product.stock > 0 && product.stock < 10).length.toString().padStart(2, '0')}</strong></article>
      <article><span>Productos agotados</span><strong>{products.filter((product) => product.stock === 0).length.toString().padStart(2, '0')}</strong></article>
    </section>;
}

function Home() {
  return <><section className="hero"><div className="hero-copy">
    <h1>Supermercado La Huerta</h1>
    <p>Bienvenido a La Huerta. Consulta los productos disponibles y administra el inventario de tu supermercado.</p>
    <Link className="button" to="/inventario">Ver inventario <span aria-hidden="true">→</span></Link>
    </div><div className="hero-produce" aria-hidden="true"><span>🥦</span><span>🍎</span><span>🥕</span><span>🍊</span></div>
  </section><InventorySummary /></>;
}

function Inventory() {
  const { products } = useInventory();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todas');
  const normalize = (value) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const filtered = products.filter((product) => (category === 'Todas' || product.category === category) && normalize(`${product.name} ${product.brand} ${product.id}`).includes(normalize(search.trim())));
  return <>
    <InventorySummary />
    <section id="inventario" className="inventory">
      <div className="section-heading"><div><p className="eyebrow">NUESTROS PRODUCTOS</p><h2>Inventario del supermercado</h2></div><Link className="button" to="/agregar-articulo"><span aria-hidden="true">+</span>Agregar artículo</Link></div>
      <div className="filters"><label>Buscar producto<input type="search" placeholder="Nombre, marca o código" value={search} onChange={(event) => setSearch(event.target.value)} /></label><label>Categoría<select value={category} onChange={(event) => setCategory(event.target.value)}><option>Todas</option>{[...new Set(products.map((product) => product.category))].map((item) => <option key={item}>{item}</option>)}</select></label></div>
      <p className="result-count" role="status">{filtered.length} de {products.length} productos · Stock bajo: entre 1 y 9 unidades</p>
      <div className="table-scroll"><table><caption className="sr-only">Productos y disponibilidad del supermercado</caption><thead><tr><th scope="col">Producto</th><th scope="col">Marca</th><th scope="col">Tipo de producto</th><th scope="col">Precio</th><th scope="col">Stock</th><th scope="col">Estado</th></tr></thead><tbody>{filtered.map((product) => <tr key={product.id}><th scope="row"><div className="product"><span className="product-icon" aria-hidden="true">{product.icon}</span><span>{product.name}<small>{product.id} · {product.unit}</small></span></div></th><td>{product.brand}</td><td>{product.category}</td><td className="price">{money.format(product.price)}</td><td>{product.stock} <span className="muted">un.</span></td><td><span className={`badge ${product.stock === 0 ? 'empty' : product.stock < 10 ? 'low' : 'available'}`}>{status(product.stock)}</span></td></tr>)}</tbody></table>{filtered.length === 0 && <div className="no-results"><h3>No encontramos productos</h3><p>Prueba otro nombre, código o categoría.</p><button onClick={() => { setSearch(''); setCategory('Todas'); }}>Limpiar filtros</button></div>}</div>
    </section>
  </>;
}

function About() {
  return <section className="content-page"><p className="eyebrow">CONOCE LA HUERTA</p><h1>Quiénes somos</h1><p className="intro">Creemos que una buena compra empieza con productos frescos, precios claros y una atención cercana.</p><div className="story"><article><h2>Quiénes somos</h2><p>La Huerta es un supermercado de barrio ficticio creado para este proyecto académico. Nuestra propuesta reúne alimentos y productos esenciales en un espacio amable, organizado y fácil de recorrer.</p><p>Queremos acompañar la mesa de cada hogar, dando prioridad a la frescura y a una experiencia de compra sencilla.</p></article></div><div className="values"><article><span aria-hidden="true">01</span><h2>Frescura diaria</h2><p>Cuidamos la selección y disponibilidad de nuestros productos para que encuentres lo que necesitas.</p></article><article><span aria-hidden="true">02</span><h2>Atención cercana</h2><p>Escuchamos a nuestros vecinos y buscamos que cada visita sea cómoda y agradable.</p></article><article><span aria-hidden="true">03</span><h2>Información clara</h2><p>Mostramos precios y existencias de forma sencilla para facilitar tus decisiones.</p></article></div></section>;
}

function Stores() {
  const stores = [{ name: 'La Huerta Centro', address: 'Calle Los Olivos 120, Santiago', hours: 'Lunes a sábado: 09:00 a 20:00', sunday: 'Domingos: 10:00 a 15:00', icon: '🏙️' }, { name: 'La Huerta Ñuñoa', address: 'Avenida Las Semillas 450, Ñuñoa', hours: 'Lunes a sábado: 08:30 a 21:00', sunday: 'Domingos: 09:00 a 16:00', icon: '🏡' }];
  return <section className="content-page"><p className="eyebrow">SIEMPRE CERCA</p><h1>Nuestras tiendas</h1><p className="intro">Conoce nuestras tiendas y sus horarios de atención.</p><div className="stores">{stores.map((store) => <article className="store" key={store.name}><div className="store-body"><p className="eyebrow">SANTIAGO · CHILE</p><h2>{store.name}</h2><address>{store.address}</address><h3>Horario de atención</h3><p>{store.hours}<br />{store.sunday}</p></div></article>)}</div><p className="notice">Proyecto académico: las tiendas, direcciones y horarios son ficticios.</p></section>;
}

function App() {
  const { pathname } = useLocation();
  useEffect(() => { document.title = `${({ '/': 'Inicio', '/inventario': 'Inventario', '/agregar-articulo': 'Agregar artículo', '/quienes-somos': 'Quiénes somos', '/nuestras-tiendas': 'Nuestras tiendas' })[pathname] || 'Página no encontrada'} | La Huerta`; window.scrollTo(0, 0); }, [pathname]);
  return <><a className="skip-link" href="#contenido" onClick={(event) => { event.preventDefault(); document.getElementById('contenido').focus(); }}>Saltar al contenido</a><header className="header"><Link to="/" className="brand" aria-label="La Huerta, ir al inicio"><span className="brand-mark" aria-hidden="true">✳</span><span>la huerta<small>SUPERMERCADO</small></span></Link><span className="course">SEMANA 02 · PFY2202</span></header><nav className="top-nav" aria-label="Navegación principal"><NavLink to="/" end><Icon name="home" />Inicio</NavLink><NavLink to="/inventario"><Icon name="box" />Inventario</NavLink><NavLink to="/agregar-articulo"><Icon name="plus" />Agregar artículo</NavLink><NavLink to="/quienes-somos"><Icon name="people" />Quiénes somos</NavLink><NavLink to="/nuestras-tiendas"><Icon name="store" />Nuestras tiendas</NavLink></nav><main id="contenido" tabIndex={-1}><Routes><Route path="/inventario" element={<Inventory />} /><Route path="/agregar-articulo" element={<AddProduct />} /><Route path="/" element={<Home />} /><Route path="/quienes-somos" element={<About />} /><Route path="/nuestras-tiendas" element={<Stores />} /><Route path="*" element={<section className="content-page"><p className="eyebrow">ERROR 404</p><h1>Esta página no existe.</h1><p>Vuelve al inicio para explorar el supermercado.</p><Link className="button" to="/">Volver al inicio</Link></section>} /></Routes></main><footer><span>© {new Date().getFullYear()} La Huerta</span><span>Proyecto académico · Desarrollo Frontend II</span></footer></>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><HashRouter><InventoryProvider initialProducts={initialProducts}><App /></InventoryProvider></HashRouter></React.StrictMode>);










