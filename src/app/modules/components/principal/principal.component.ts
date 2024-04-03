import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Product } from '../../api/product';
import { ProductService } from '../../service/examples/product.service';
import { Subscription } from 'rxjs';
import { LayoutService } from 'src/app/modules/layout/service/app.layout.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/services/auth.service';
import { Usuario } from '../../models/usuario';
@Component({
    templateUrl: './principal.component.html',
    styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit, OnDestroy {

    items!: MenuItem[];

    products!: Product[];
    loading: boolean = false;
    chartData: any;

    chartOptions: any;

    subscription!: Subscription;

    usuario: Usuario;
    // usuario$ = this.authService.usuario$;

    constructor(private productService: ProductService,
                        public layoutService: LayoutService,
                        private spinner: NgxSpinnerService,
                        private authService: AuthService) {
        this.subscription = this.layoutService.configUpdate$.subscribe(() => {
            this.initChart();
        });
    }

    ngOnInit() {
        // this.authService.getPerfil().subscribe(user => {
        //     this.usuario = user[0];
        //     console.log("Usuari Principal: ", this.usuario);
        // })


        this.initChart();
        // this.productService.getProductsSmall().then(data => this.products = data);

        this.items = [
            { label: 'Add New', icon: 'pi pi-fw pi-plus' },
            { label: 'Remove', icon: 'pi pi-fw pi-minus' }
        ];
        // this.loading = true;
        // setTimeout(() => {
        //     this.loading = false;
        // }, 100);

        this.spinner.show(); // Mostrar el spinner antes de la llamada al servicio

        this.authService.usuario$.subscribe(
          (user: any) => {
            if (user) {
              if (Array.isArray(user) && user.length > 0) {
                this.usuario = user[0];
                this.spinner.hide();
                // Realizar acciones adicionales si es necesario con this.usuario
            //   } else {
                // Manejar el caso en que user no es un array o es un array vacío
                // console.error("El objeto 'user' no es un array o es un array vacío.");
              }
            // } else {
              // Manejar el caso en que user es null
            //   console.error("El objeto 'user' es nulo.");
            }

          },
          (error: any) => {
            // Manejar errores de la suscripción al observable
            console.error("Error al obtener el usuario:", error);
            this.spinner.hide();
          },
        );



    }

    initChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        this.chartData = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'First Dataset',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--bluegray-700'),
                    borderColor: documentStyle.getPropertyValue('--bluegray-700'),
                    tension: .4
                },
                {
                    label: 'Second Dataset',
                    data: [28, 48, 40, 19, 86, 27, 90],
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--green-600'),
                    borderColor: documentStyle.getPropertyValue('--green-600'),
                    tension: .4
                }
            ]
        };

        this.chartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
