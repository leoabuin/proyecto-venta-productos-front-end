import { TestBed } from '@angular/core/testing';

import { PriceApiService } from './price-api.service';

describe('PriceApiService', () => {
  let service: PriceApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PriceApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
