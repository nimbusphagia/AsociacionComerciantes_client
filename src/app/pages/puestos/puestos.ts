import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PuestoService } from '../../services/puesto-service';
import { SocioService } from '../../services/socio-service';
import { SocioResponse } from '../../models/Socio';
import { PuestoResponse } from '../../models/Puesto';
import { PuestoRequest } from '../../models/Puesto';

@Component({
  selector: 'app-puestos',
  imports: [CommonModule, FormsModule],
  templateUrl: './puestos.html',
  styleUrl: './puestos.css',
})
export class Puestos implements OnInit {
  private puestoService = inject(PuestoService);
  private socioService = inject(SocioService);

  puestos = signal<PuestoResponse[]>([]);
  socios = signal<SocioResponse[]>([]);
  isLoading = signal(false);
  errorMessage = signal('');

  mostrarModalForm = signal(false);
  esEdicion = signal(false);
  puestoForm = signal<PuestoRequest>({ codigo: '', nombre: '', direccion: '' });
  puestoError = signal('');
  guardando = signal(false);
  puestoIdParaEditar: number | null = null;

  mostrarModalSocio = signal(false);
  puestoSeleccionado = signal<PuestoResponse | null>(null);
  socioError = signal('');
  asignando = signal(false);
  selectedSocioId: number | null = null;

  ngOnInit(): void {
    this.cargarPuestos();
    this.cargarSocios();
  }

  cargarPuestos(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.puestoService.listar().subscribe({
      next: (data) => {
        this.puestos.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Error al cargar los puestos.');
        this.isLoading.set(false);
      },
    });
  }

  cargarSocios(): void {
    this.socioService.listar().subscribe({
      next: (data) => {
        this.socios.set(data);
      },
      error: () => {
        console.error('Error al cargar la lista de socios.');
      },
    });
  }

  abrirCrearModal(): void {
    this.esEdicion.set(false);
    this.puestoForm.set({ codigo: '', nombre: '', direccion: '' });
    this.puestoError.set('');
    this.puestoIdParaEditar = null;
    this.mostrarModalForm.set(true);
  }

  abrirEditarModal(puesto: PuestoResponse): void {
    this.esEdicion.set(true);
    this.puestoForm.set({
      codigo: puesto.codigo,
      nombre: puesto.nombre,
      direccion: puesto.direccion,
    });
    this.puestoError.set('');
    this.puestoIdParaEditar = puesto.id;
    this.mostrarModalForm.set(true);
  }

  cerrarFormModal(): void {
    this.mostrarModalForm.set(false);
    this.puestoError.set('');
  }

  guardarPuesto(): void {
    const form = this.puestoForm();
    if (!form.codigo || !form.nombre || !form.direccion) {
      this.puestoError.set('Todos los campos son obligatorios.');
      return;
    }

    this.guardando.set(true);
    this.puestoError.set('');

    const peticion$ =
      this.esEdicion() && this.puestoIdParaEditar
        ? this.puestoService.actualizar(this.puestoIdParaEditar, form)
        : this.puestoService.crear(form);

    peticion$.subscribe({
      next: () => {
        this.cargarPuestos();
        this.guardando.set(false);
        this.cerrarFormModal();
      },
      error: () => {
        this.puestoError.set('Error al procesar la solicitud del puesto.');
        this.guardando.set(false);
      },
    });
  }

  abrirAsignarSocioModal(puesto: PuestoResponse): void {
    this.puestoSeleccionado.set(puesto);
    this.selectedSocioId = puesto.socioId;
    this.socioError.set('');
    this.mostrarModalSocio.set(true);
  }

  cerrarSocioModal(): void {
    this.mostrarModalSocio.set(false);
    this.puestoSeleccionado.set(null);
    this.selectedSocioId = null;
  }

  confirmarAsignacion(): void {
    const puesto = this.puestoSeleccionado();
    if (!puesto || this.selectedSocioId === null) {
      this.socioError.set('Por favor, selecciona un socio válido.');
      return;
    }

    this.asignando.set(true);
    this.socioError.set('');

    this.puestoService.asignarSocio(puesto.id, Number(this.selectedSocioId)).subscribe({
      next: () => {
        this.cargarPuestos();
        this.asignando.set(false);
        this.cerrarSocioModal();
      },
      error: () => {
        this.socioError.set('Error al asignar el socio al puesto.');
        this.asignando.set(false);
      },
    });
  }
  desasignarSocio(puestoId: number): void {
    if (!confirm('¿Estás seguro de quitar el socio asignado a este puesto?')) {
      return;
    }

    this.isLoading.set(true);

    this.puestoService.desasignarSocio(puestoId).subscribe({
      next: () => {
        this.cargarPuestos();
      },
      error: (err) => {
        console.error(err);
        alert('Error al intentar desasignar el socio.');
        this.isLoading.set(false);
      },
    });
  }
  eliminarPuesto(id: number): void {
    if (!confirm('¿Estás seguro de eliminar este puesto?')) return;

    this.puestoService.eliminar(id).subscribe({
      next: () => {
        this.cargarPuestos();
      },
      error: () => {
        alert('Error al intentar eliminar el puesto.');
      },
    });
  }
}
