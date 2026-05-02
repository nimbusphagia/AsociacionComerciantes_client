import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { PuestoResponse, PuestoRequest } from '../models/Puesto';

@Injectable({
  providedIn: 'root',
})
export class PuestoService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/puestos`;

  listar(): Observable<PuestoResponse[]> {
    return this.http.get<PuestoResponse[]>(this.apiUrl);
  }

  obtener(id: number): Observable<PuestoResponse> {
    return this.http.get<PuestoResponse>(`${this.apiUrl}/${id}`);
  }

  crear(puesto: PuestoRequest): Observable<PuestoResponse> {
    return this.http.post<PuestoResponse>(this.apiUrl, puesto);
  }

  actualizar(id: number, puesto: PuestoRequest): Observable<PuestoResponse> {
    return this.http.put<PuestoResponse>(`${this.apiUrl}/${id}`, puesto);
  }

  asignarSocio(puestoId: number, socioId: number): Observable<PuestoResponse> {
    return this.http.put<PuestoResponse>(`${this.apiUrl}/${puestoId}/socio/${socioId}`, {});
  }
  desasignarSocio(puestoId: number): Observable<PuestoResponse> {
    return this.http.delete<PuestoResponse>(`${this.apiUrl}/${puestoId}/socio`, {});
  }

  eliminar(id: number): Observable<void> {
    console.log(id);
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
