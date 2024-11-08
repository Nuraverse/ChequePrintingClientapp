import { TestBed } from '@angular/core/testing';

import { ContractService } from './contract-service.service';

describe('ChequeServiceService', () => {
  let service: ContractService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContractService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
