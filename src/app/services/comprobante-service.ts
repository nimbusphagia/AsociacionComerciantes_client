import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { ComprobanteResponse } from '../models/Comprobante';

@Injectable({ providedIn: 'root' })
export class ComprobanteService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/comprobantes`;

  obtenerPorPago(pagoId: number): Observable<ComprobanteResponse> {
    return this.http.get<ComprobanteResponse>(`${this.apiUrl}/${pagoId}`);
  }
}
