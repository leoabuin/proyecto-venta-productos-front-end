import { createLocalStorageMock } from '../src/app/test-utils';

describe('createLocalStorageMock', () => {
  it('should set, get and remove values from localStorage', () => {
    const mock = createLocalStorageMock();

    mock.setItem('a', '1');
    expect(mock.getItem('a')).toBe('1');

    mock.removeItem('a');
    expect(mock.getItem('a')).toBeNull();
  });
});
