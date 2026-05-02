import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { SocioService } from '../../services/socio-service';
import { PuestoService } from '../../services/puesto-service';
import { DeudaService } from '../../services/deuda-service';
import { PagoService } from '../../services/pago-service';
import { SocioResponse } from '../../models/Socio';
import { PuestoResponse } from '../../models/Puesto';
import { Deuda } from '../../models/Deuda';
import { PagoResponse } from '../../models/Pago';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private socioService = inject(SocioService);
  private puestoService = inject(PuestoService);
  private deudaService = inject(DeudaService);
  private pagoService = inject(PagoService);

  isLoading = signal(false);
  errorMessage = signal('');

  socios = signal<SocioResponse[]>([]);
  puestos = signal<PuestoResponse[]>([]);
  deudas = signal<Deuda[]>([]);
  pagos = signal<PagoResponse[]>([]);

  totalSocios = computed(() => this.socios().filter((s) => s.activo).length);
  totalPuestos = computed(() => this.puestos().length);
  puestosOcupados = computed(() => this.puestos().filter((p) => p.socioId).length);

  deudasPendientes = computed(() => this.deudas().filter((d) => d.estado === 'PENDIENTE'));
  deudasVencidas = computed(() => this.deudas().filter((d) => d.estado === 'VENCIDO'));

  montoPendiente = computed(() =>
    this.deudasPendientes().reduce((sum, d) => sum + d.montoTotal, 0),
  );
  montoVencido = computed(() => this.deudasVencidas().reduce((sum, d) => sum + d.montoTotal, 0));

  ultimosPagos = computed(() =>
    [...this.pagos()]
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
      .slice(0, 5),
  );

  ngOnInit(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    forkJoin({
      socios: this.socioService.listar(),
      puestos: this.puestoService.listar(),
      deudas: this.deudaService.listar(),
      pagos: this.pagoService.listar(),
    }).subscribe({
      next: ({ socios, puestos, deudas, pagos }) => {
        this.socios.set(socios);
        this.puestos.set(puestos);
        this.deudas.set(deudas);
        this.pagos.set(pagos);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Error al cargar el dashboard.');
        this.isLoading.set(false);
      },
    });
  }
}
