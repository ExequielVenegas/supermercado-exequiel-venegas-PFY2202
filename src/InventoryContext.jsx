import { createContext, useContext, useState } from 'react';

const InventoryContext = createContext(null);

export function InventoryProvider({ initialProducts, children }) {
  const [products, setProducts] = useState(initialProducts);

  function addProduct(product) {
    setProducts((current) => [...current, { ...product, id: crypto.randomUUID(), icon: '🛒' }]);
  }

  return <InventoryContext.Provider value={{ products, addProduct }}>{children}</InventoryContext.Provider>;
}

export function useInventory() {
  const inventory = useContext(InventoryContext);
  if (!inventory) throw new Error('El inventario requiere InventoryProvider');
  return inventory;
}
