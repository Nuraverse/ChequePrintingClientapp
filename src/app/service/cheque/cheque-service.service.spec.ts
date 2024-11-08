import { TestBed } from '@angular/core/testing';

import { ChequeService } from './cheque-service.service';

describe('ChequeServiceService', () => {
  let service: ChequeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChequeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
