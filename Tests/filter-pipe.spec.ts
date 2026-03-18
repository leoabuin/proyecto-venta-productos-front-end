import { filterProductsByName } from '../src/app/test-utils';

describe('filterProductsByName', () => {
  it('should filter products by name (case-insensitive)', () => {
    const products = [
      { name: 'Zapato' },
      { name: 'Camisa' },
      { name: 'zapatero' },
    ];

    const result = filterProductsByName(products, 'zap');

    expect(result).toEqual([
      { name: 'Zapato' },
      { name: 'zapatero' },
    ]);
  });
});
