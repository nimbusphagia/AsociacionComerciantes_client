# Sistema de Gestión de Mercado — Frontend

Interfaz web desarrollada en Angular para la gestión de socios, puestos, tarifas, deudas y pagos desde un panel centralizado.


## Tecnologías

- Angular 21 (standalone, signals, zoneless)
- TypeScript
- RxJS
- Angular Router
- HttpClient con interceptor JWT


## Funcionalidades

### Autenticación
- Login con email y contraseña
- Token JWT almacenado en localStorage
- Rutas protegidas mediante guard
- Interceptor que adjunta el token en cada petición

### Dashboard
- Resumen de socios, puestos y deudas
- Indicador de deudas vencidas
- Últimos pagos registrados

### Socios
- CRUD de socios
- Vista detallada con:
  - Puestos asignados
  - Deudas pendientes

### Puestos
- CRUD de puestos
- Asignación de socios
- Puestos sin socio pertenecen a la asociación


### Tarifas
- CRUD de tarifas
- Tipos de recurrencia:
  - Mensual
  - Anual
  - Único


### Deudas
- Generadas por **puesto**
- Un socio con múltiples puestos tiene deudas independientes
- Permite seleccionar múltiples deudas del mismo puesto para un solo pago
- Registro de comprobantes (boleta o factura)


### Pagos
- Historial de pagos
- Visualización de comprobantes

## Seguridad

El sistema utiliza JWT para autenticación.  
El token se envía automáticamente en cada request mediante interceptor.

> La validación de seguridad es responsabilidad del backend.


## Entornos

Configuración en `src/environments/`:

- `environment.ts` (producción)
- `environment.development.ts` (desarrollo)
- `environment.interface.ts` (estructura base)

Ejemplo:

```ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080',
};
