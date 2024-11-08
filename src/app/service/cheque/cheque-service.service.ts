import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Bank, Cheque } from '../../model/model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ChequeService {
  private baseUrl = environment.apiUrl + '/api/cheques';

  constructor(private http: HttpClient) {}

  createCheque(chequeData: Cheque): Observable<Cheque> {
    return this.http.post<Cheque>(`${this.baseUrl}/v1/save`, chequeData);
  }

  getCheque(chequeId: number): Observable<Cheque> {
    return this.http.get<Cheque>(`${this.baseUrl}/v1/${chequeId}`);
  }

  getBanks(): Observable<Bank[]> {
    return this.http.get<Bank[]>(`${this.baseUrl}/v1/banks`);
  }

  updateCheque(chequeId: number, chequeData: Cheque): Observable<Cheque> {
    return this.http.put<Cheque>(`${this.baseUrl}/v1/${chequeId}`, chequeData);
  }

  deleteCheque(chequeId: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/v1/${chequeId}`);
  }
}
