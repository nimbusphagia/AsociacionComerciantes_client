export interface ComprobanteResponse {
  id: number;
  numeroCorrelativo: string;
  tipo: 'BOLETA' | 'FACTURA';
  fechaEmision: Date;
  pagoId: number;
  nombreSocio: string;
  montoTotal: number;
}
