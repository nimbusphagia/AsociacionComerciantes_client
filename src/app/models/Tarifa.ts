export interface TarifaRequest {
  nombre: string;
  monto: number;
  recurrencia: 'MENSUAL' | 'ANUAL' | 'UNICO';
}
export interface TarifaResponse {
  id: number;
  nombre: string;
  monto: number;
  recurrencia: 'MENSUAL' | 'ANUAL' | 'UNICO';
  activo: boolean;
}
