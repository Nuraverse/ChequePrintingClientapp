import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Contract } from '../../model/model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ContractService {
  private baseUrl = environment.apiUrl + '/api/contracts';

  constructor(private http: HttpClient) {}

  getContract(contractNo: number): Observable<Contract> {
    return this.http.get<Contract>(`${this.baseUrl}/v1/view/${contractNo}`);
  }
}
