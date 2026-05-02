import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { TarifaRequest, TarifaResponse } from '../models/Tarifa';

@Injectable({ providedIn: 'root' })
export class TarifaService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/tarifas`;

  listar(): Observable<TarifaResponse[]> {
    return this.http.get<TarifaResponse[]>(this.apiUrl);
  }

  crear(request: TarifaRequest): Observable<TarifaResponse> {
    return this.http.post<TarifaResponse>(this.apiUrl, request);
  }

  editar(id: number, request: TarifaRequest): Observable<TarifaResponse> {
    return this.http.put<TarifaResponse>(`${this.apiUrl}/${id}`, request);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
