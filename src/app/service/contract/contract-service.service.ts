import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Agreement } from '../../model/model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AgreemrntService {
  private baseUrl = environment.apiUrl + '/api/contracts';

  constructor(private http: HttpClient) {}

  getAgreement(agreementNo: number): Observable<Agreement> {
    return this.http.get<Agreement>(`${this.baseUrl}/v1/view/${agreementNo}`);
  }
}
