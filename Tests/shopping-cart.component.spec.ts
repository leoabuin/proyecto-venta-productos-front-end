import { calculateTotal } from '../src/app/test-utils';

describe('calculateTotal', () => {
  it('should calculate total correctly based on cartItems', () => {
    const total = calculateTotal([
      { item_price: 10 },
      { item_price: 25.5 },
    ]);

    expect(total).toBe(35.5);
  });
});
