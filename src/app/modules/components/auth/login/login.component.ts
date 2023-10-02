import { Component } from '@angular/core';
import { LayoutService } from 'src/app/modules/layout/service/app.layout.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { RequestStatus } from 'src/app/modules/models/request-status.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [`
    :host ::ng-deep .pi-eye,
    :host ::ng-deep .pi-eye-slash {
      transform: scale(1.6);
      margin-right: 1rem;
      color: var(--primary-color) !important;
    }
  `]
})
export class LoginComponent {
  valCheck: string[] = ['remember'];

 
  email: string;
  password: string;

  status: RequestStatus = 'init';

  constructor(
    public layoutService: LayoutService,
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) { }

  doLogin() {
    
    console.log("Email y Password: ",this.email, this.password)


    this.status = 'loading';

    const loginData = {
      
      email: this.email,
      password: this.password
    };

    this.authService.login(loginData.email, loginData.password)
    .subscribe({
        next: () => {
            this.status = 'success';
            this.router.navigate(['/principal']);
        },
        error: () => {
            this.status = 'failed';
        }
    })


    // // Realizar la solicitud POST a la API para autenticar al usuario
    // this.http.post('/api/login', loginData).subscribe(
    //   (response) => {
    //     // Manejar la respuesta exitosa aquí, por ejemplo, redirigir a la página principal
    //     this.status = 'success';
    //     this.router.navigate(['/principal']);
    //   },
    //   (error) => {
    //     // Manejar el error aquí, por ejemplo, mostrar un mensaje de error al usuario
    //     this.status = 'failed';
    //     console.error('Error en el inicio de sesión:', error);
    //   }
    // );
  }
}
