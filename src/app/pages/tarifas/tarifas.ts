import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TarifaService } from '../../services/tarifa-service';
import { TarifaRequest, TarifaResponse } from '../../models/Tarifa';

const FORM_VACIO: TarifaRequest = {
  nombre: '',
  monto: 0,
  recurrencia: 'MENSUAL',
};

@Component({
  selector: 'app-tarifas',
  imports: [CommonModule, FormsModule],
  templateUrl: './tarifas.html',
  styleUrl: './tarifas.css',
})
export class Tarifas implements OnInit {
  private tarifaService = inject(TarifaService);

  tarifas = signal<TarifaResponse[]>([]);
  isLoading = signal(false);
  errorMessage = signal('');

  mostrarModal = signal(false);
  esEdicion = signal(false);
  editandoId = signal<number | null>(null);
  tarifaForm = signal<TarifaRequest>({ ...FORM_VACIO });
  guardando = signal(false);
  formError = signal('');

  eliminando = signal<number | null>(null);
  deleteError = signal('');

  ngOnInit(): void {
    this.cargarTarifas();
  }

  cargarTarifas(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.tarifaService.listar().subscribe({
      next: (data) => {
        this.tarifas.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Error al cargar las tarifas.');
        this.isLoading.set(false);
      },
    });
  }

  abrirCrearModal(): void {
    this.esEdicion.set(false);
    this.editandoId.set(null);
    this.tarifaForm.set({ ...FORM_VACIO });
    this.formError.set('');
    this.mostrarModal.set(true);
  }

  abrirEditarModal(tarifa: TarifaResponse): void {
    this.esEdicion.set(true);
    this.editandoId.set(tarifa.id);
    this.tarifaForm.set({
      nombre: tarifa.nombre,
      monto: tarifa.monto,
      recurrencia: tarifa.recurrencia,
    });
    this.formError.set('');
    this.mostrarModal.set(true);
  }

  cerrarModal(): void {
    this.mostrarModal.set(false);
    this.formError.set('');
  }

  guardarTarifa(): void {
    this.guardando.set(true);
    this.formError.set('');

    const request = this.tarifaForm();
    const op = this.esEdicion()
      ? this.tarifaService.editar(this.editandoId()!, request)
      : this.tarifaService.crear(request);

    op.subscribe({
      next: () => {
        this.mostrarModal.set(false);
        this.cargarTarifas();
        this.guardando.set(false);
      },
      error: () => {
        this.formError.set('Error al guardar la tarifa.');
        this.guardando.set(false);
      },
    });
  }

  eliminarTarifa(id: number): void {
    this.eliminando.set(id);
    this.deleteError.set('');
    this.tarifaService.eliminar(id).subscribe({
      next: () => {
        this.eliminando.set(null);
        this.cargarTarifas();
      },
      error: () => {
        this.deleteError.set('No se puede eliminar esta tarifa.');
        this.eliminando.set(null);
      },
    });
  }
}
