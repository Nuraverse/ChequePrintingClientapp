import { TestBed } from '@angular/core/testing';

import { AmountToWordsService } from './amount-to-words.service';

describe('AmountToWordsService', () => {
  let service: AmountToWordsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AmountToWordsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
