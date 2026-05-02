import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { SocioDetalleResponse, SocioRequest, SocioResponse } from '../models/Socio';

@Injectable({
  providedIn: 'root',
})
export class SocioService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/socios`;

  listar(): Observable<SocioResponse[]> {
    return this.http.get<SocioResponse[]>(this.apiUrl);
  }
  obtenerDetalle(id: number): Observable<SocioDetalleResponse> {
    return this.http.get<SocioDetalleResponse>(`${this.apiUrl}/${id}`);
  }

  crear(request: SocioRequest): Observable<SocioResponse> {
    return this.http.post<SocioResponse>(this.apiUrl, request);
  }

  editar(id: number, request: SocioRequest): Observable<SocioResponse> {
    return this.http.put<SocioResponse>(`${this.apiUrl}/${id}`, request);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
