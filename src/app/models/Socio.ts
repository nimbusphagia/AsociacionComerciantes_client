import { PuestoResponse } from './Puesto';
import { Deuda } from './Deuda';

export interface SocioResponse {
  id: number;
  nombreCompleto: string;
  dni: string;
  ruc: string;
  celular: string;
  email: string;
  direccion: string;
  activo: boolean;
}
export interface SocioRequest {
  nombreCompleto: string;
  dni: string;
  ruc: string;
  celular: string;
  email: string;
  direccion: string;
}
export interface SocioDetalleResponse {
  id: number;
  nombreCompleto: string;
  dni: string;
  ruc: string;
  celular: string;
  email: string;
  direccion: string;
  activo: boolean;
  puestos: PuestoResponse[];
  deudasPendientes: Deuda[];
}
