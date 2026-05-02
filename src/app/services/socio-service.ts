import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { SocioResponse } from '../models/Socio';

@Injectable({
  providedIn: 'root',
})
export class SocioService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/socios`;

  listar(): Observable<SocioResponse[]> {
    return this.http.get<SocioResponse[]>(this.apiUrl);
  }
}
