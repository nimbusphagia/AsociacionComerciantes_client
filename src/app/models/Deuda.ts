export interface DeudaDetalle {
  id: number,
  nombrePuesto: string,
  nombreTarifa: string,
  monto: number,
}

export interface Deuda {
  id: number;
  periodo: string;
  montoTotal: number;
  estado: 'PENDIENTE' | 'PAGADO' | 'VENCIDO';
  fechaVencimiento: string;
  detalles: DeudaDetalle[];
}
