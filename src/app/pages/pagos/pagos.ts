import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagoService } from '../../services/pago-service';
import { ComprobanteService } from '../../services/comprobante-service';
import { PagoResponse } from '../../models/Pago';
import { ComprobanteResponse } from '../../models/Comprobante';

@Component({
  selector: 'app-pagos',
  imports: [CommonModule],
  templateUrl: './pagos.html',
  styleUrl: './pagos.css',
})
export class Pagos implements OnInit {
  private pagoService = inject(PagoService);
  private comprobanteService = inject(ComprobanteService);

  pagos = signal<PagoResponse[]>([]);
  isLoading = signal(false);
  errorMessage = signal('');

  mostrarModal = signal(false);
  comprobante = signal<ComprobanteResponse | null>(null);
  comprobanteLoading = signal(false);
  comprobanteError = signal('');

  ngOnInit(): void {
    this.cargarPagos();
  }

  cargarPagos(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.pagoService.listar().subscribe({
      next: (data) => {
        this.pagos.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Error al cargar los pagos.');
        this.isLoading.set(false);
      },
    });
  }

  verComprobante(pagoId: number): void {
    this.comprobante.set(null);
    this.comprobanteError.set('');
    this.comprobanteLoading.set(true);
    this.mostrarModal.set(true);

    this.comprobanteService.obtenerPorPago(pagoId).subscribe({
      next: (data) => {
        this.comprobante.set(data);
        this.comprobanteLoading.set(false);
      },
      error: () => {
        this.comprobanteError.set('Error al cargar el comprobante.');
        this.comprobanteLoading.set(false);
      },
    });
  }

  cerrarModal(): void {
    this.mostrarModal.set(false);
    this.comprobante.set(null);
    this.comprobanteError.set('');
  }
}
