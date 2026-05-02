import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DeudaService } from '../../services/deuda-service';
import { PagoService } from '../../services/pago-service';
import { Deuda } from '../../models/Deuda';

@Component({
  selector: 'app-deudas',
  imports: [CommonModule, FormsModule],
  templateUrl: './deudas.html',
  styleUrl: './deudas.css',
})
export class Deudas implements OnInit {
  private deudaService = inject(DeudaService);
  private pagoService = inject(PagoService);

  constructor() {
    effect(() => {
      if (this.selectedDeudas().length === 0) {
        this.mostrarForm.set(false);
      }
    });
  }

  deudas = signal<Deuda[]>([]);
  isLoading = signal(false);
  errorMessage = signal('');

  selectedDeudas = signal<Deuda[]>([]);
  activeSocioId = computed(() =>
    this.selectedDeudas().length > 0 ? this.selectedDeudas()[0].socioId : null
  );
  tipoComprobante = signal<'BOLETA' | 'FACTURA'>('BOLETA');

  mostrarForm = signal(false);
  pagoLoading = signal(false);
  pagoError = signal('');

  montoCalculado = computed(() =>
    this.selectedDeudas().reduce((sum, d) => sum + d.montoTotal, 0)
  );

  ngOnInit(): void {
    this.cargarDeudas();
  }

  cargarDeudas(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.deudaService.listar().subscribe({
      next: (data) => {
        this.deudas.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Error al cargar las deudas.');
        this.isLoading.set(false);
      }
    });
  }

  toggleDeuda(deuda: Deuda): void {
    const current = this.selectedDeudas();
    const isSelected = current.some(d => d.id === deuda.id);
    if (isSelected) {
      this.selectedDeudas.set(current.filter(d => d.id !== deuda.id));
    } else {
      this.selectedDeudas.update(list => [...list, deuda]);
      this.mostrarForm.set(true);
    }
  }

  isDisabled(deuda: Deuda): boolean {
    if (deuda.estado === 'PAGADO') return true;
    const activeSocio = this.activeSocioId();
    return activeSocio !== null && deuda.socioId !== activeSocio;
  }

  isSelected(deuda: Deuda): boolean {
    return this.selectedDeudas().some(d => d.id === deuda.id);
  }

  cerrarForm(): void {
    this.mostrarForm.set(false);
    this.pagoError.set('');
  }
  confirmarPago(): void {
    this.pagoLoading.set(true);
    this.pagoError.set('');

    this.pagoService.registrar({
      socioId: this.activeSocioId()!,
      deudaIds: this.selectedDeudas().map(d => d.id),
      tipoComprobante: this.tipoComprobante(),
    }).subscribe({
      next: () => {
        this.selectedDeudas.set([]);
        this.cargarDeudas();
        this.pagoLoading.set(false);
      },
      error: () => {
        this.pagoError.set('Error al registrar el pago. Intente de nuevo.');
        this.pagoLoading.set(false);
      }
    });
  }
}
