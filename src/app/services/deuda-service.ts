import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Deuda } from '../models/Deuda';

export interface DeudaFiltros {
  socioId?: number;
  estado?: string;
  periodo?: string;
}
@Injectable({
  providedIn: 'root',
})
export class DeudaService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/deudas`;

  listar(filtros?: DeudaFiltros): Observable<Deuda[]> {
    let params = new HttpParams();
    if (filtros?.socioId) params = params.set('socioId', filtros.socioId);
    if (filtros?.estado) params = params.set('estado', filtros.estado);
    if (filtros?.periodo) params = params.set('periodo', filtros.periodo);
    return this.http.get<Deuda[]>(this.apiUrl, { params });
  }

  obtener(id: number): Observable<Deuda> {
    return this.http.get<Deuda>(`${this.apiUrl}/${id}`);
  }
}
