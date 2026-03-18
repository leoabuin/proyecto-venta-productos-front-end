export type Product = { name: string; item_price?: number; quantity?: number; productId?: number };

export function filterProductsByName(products: Product[], query: string): Product[] {
  const normalized = query.toLowerCase();
  return products.filter(p => p.name.toLowerCase().includes(normalized));
}

export function calculateTotal(cartItems: Array<{ item_price: number }>): number {
  return cartItems.reduce((acc, item) => acc + item.item_price, 0);
}

export function getRoleFromStorage(getItem: (key: string) => string | null): string {
  const role = getItem('user_role');
  return role ?? 'Invitado';
}

export function createLocalStorageMock(): { getItem: (k: string) => string | null; setItem: (k: string, v: string) => void; removeItem: (k: string) => void } {
  const store: Record<string, string> = {};
  return {
    getItem: (key: string) => (key in store ? store[key] : null),
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
  };
}
