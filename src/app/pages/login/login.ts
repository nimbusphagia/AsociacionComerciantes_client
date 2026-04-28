import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = '';
  contrasena = '';
  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: Auth,
    private router: Router
  ) { }

  onSubmit(): void {
    if (!this.email || !this.contrasena) {
      this.errorMessage = "Debes completar todos los campos.";
      return
    }
    this.isLoading = true;
    this.errorMessage = '';
    this.authService.login(this.email, this.contrasena).subscribe({
      next: () => {
        console.log('Logged in succesful!');
        this.router.navigate(['/home']);
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;
        this.errorMessage =
          err.status === 401
            ? 'El email o contraseña son incorrectos.'
            : "Ocurrio un error. Intente de nuevo"
      },
      complete: () => this.isLoading = false,
    });
  }
}
