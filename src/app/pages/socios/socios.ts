import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SocioService } from '../../services/socio-service';
import { SocioResponse, SocioRequest, SocioDetalleResponse } from '../../models/Socio';

const FORM_VACIO: SocioRequest = {
  nombreCompleto: '',
  dni: '',
  ruc: '',
  celular: '',
  email: '',
  direccion: '',
};

@Component({
  selector: 'app-socios',
  imports: [CommonModule, FormsModule],
  templateUrl: './socios.html',
  styleUrl: './socios.css',
})
export class Socios implements OnInit {
  private socioService = inject(SocioService);

  socios = signal<SocioResponse[]>([]);
  isLoading = signal(false);
  errorMessage = signal('');

  expandedSocioId = signal<number | null>(null);
  detalle = signal<SocioDetalleResponse | null>(null);
  detalleLoading = signal(false);
  detalleError = signal('');

  mostrarModal = signal(false);
  esEdicion = signal(false);
  editandoId = signal<number | null>(null);
  socioForm = signal<SocioRequest>({ ...FORM_VACIO });
  guardando = signal(false);
  formError = signal('');

  eliminando = signal<number | null>(null);
  deleteError = signal('');

  ngOnInit(): void {
    this.cargarSocios();
  }

  cargarSocios(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.socioService.listar().subscribe({
      next: (data) => {
        this.socios.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Error al cargar los socios.');
        this.isLoading.set(false);
      },
    });
  }

  toggleDetalle(socio: SocioResponse): void {
    if (this.expandedSocioId() === socio.id) {
      this.expandedSocioId.set(null);
      this.detalle.set(null);
      return;
    }
    this.expandedSocioId.set(socio.id);
    this.detalle.set(null);
    this.detalleLoading.set(true);
    this.detalleError.set('');

    this.socioService.obtenerDetalle(socio.id).subscribe({
      next: (data) => {
        this.detalle.set(data);
        this.detalleLoading.set(false);
      },
      error: () => {
        this.detalleError.set('Error al cargar el detalle.');
        this.detalleLoading.set(false);
      },
    });
  }

  isExpanded(socio: SocioResponse): boolean {
    return this.expandedSocioId() === socio.id;
  }

  abrirCrearModal(): void {
    this.esEdicion.set(false);
    this.editandoId.set(null);
    this.socioForm.set({ ...FORM_VACIO });
    this.formError.set('');
    this.mostrarModal.set(true);
  }

  abrirEditarModal(socio: SocioResponse): void {
    this.esEdicion.set(true);
    this.editandoId.set(socio.id);
    this.socioForm.set({
      nombreCompleto: socio.nombreCompleto,
      dni: socio.dni,
      ruc: socio.ruc,
      celular: socio.celular,
      email: socio.email,
      direccion: socio.direccion,
    });
    this.formError.set('');
    this.mostrarModal.set(true);
  }

  cerrarModal(): void {
    this.mostrarModal.set(false);
    this.formError.set('');
  }

  guardarSocio(): void {
    this.guardando.set(true);
    this.formError.set('');

    const request = this.socioForm();
    const op = this.esEdicion()
      ? this.socioService.editar(this.editandoId()!, request)
      : this.socioService.crear(request);

    op.subscribe({
      next: () => {
        this.mostrarModal.set(false);
        this.cargarSocios();
        this.guardando.set(false);
      },
      error: () => {
        this.formError.set('Error al guardar el socio.');
        this.guardando.set(false);
      },
    });
  }

  eliminarSocio(id: number): void {
    this.eliminando.set(id);
    this.deleteError.set('');
    this.socioService.eliminar(id).subscribe({
      next: () => {
        this.eliminando.set(null);
        if (this.expandedSocioId() === id) {
          this.expandedSocioId.set(null);
          this.detalle.set(null);
        }
        this.cargarSocios();
      },
      error: () => {
        this.deleteError.set('No se puede eliminar este socio.');
        this.eliminando.set(null);
      },
    });
  }
}
