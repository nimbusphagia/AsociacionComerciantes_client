import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { DeudaService } from '../../services/deuda-service';
import { Deuda } from '../../models/Deuda';

@Component({
  selector: 'app-deudas',
  imports: [CommonModule],
  templateUrl: './deudas.html',
  styleUrl: './deudas.css',
})
export class Deudas implements OnInit {
  private deudaService = inject(DeudaService);

  deudas = signal<Deuda[]>([]);
  isLoading = signal(false);
  errorMessage = signal('');

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

  registrarPago(deuda: Deuda): void {
    console.log('Registrar pago para deuda:', deuda.id);
  }
}
