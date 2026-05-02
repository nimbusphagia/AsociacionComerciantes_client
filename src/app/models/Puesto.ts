export interface PuestoRequest {
  codigo: string;
  nombre: string;
  direccion: string;
}

export interface PuestoResponse {
  id: number;
  codigo: string;
  nombre: string;
  direccion: string;
  socioId: number;
  nombreSocio: string;
}
