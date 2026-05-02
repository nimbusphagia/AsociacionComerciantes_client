export interface PagoRequest {
  socioId: number;
  deudaIds: number[];
  tipoComprobante: 'BOLETA' | 'FACTURA';
}

export interface PagoResponse {
  id: number;
  socioId: number;
  nombreSocio: string;
  montoTotal: number;
  fecha: string;
  deudaIds: number[];
}
