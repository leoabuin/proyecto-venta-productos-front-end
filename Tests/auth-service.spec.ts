import { getRoleFromStorage } from '../src/app/test-utils';

describe('getRoleFromStorage', () => {
  it('should return Invitado when no role is stored and report not logged in', () => {
    const role = getRoleFromStorage(() => null);

    expect(role).toBe('Invitado');
  });
});
