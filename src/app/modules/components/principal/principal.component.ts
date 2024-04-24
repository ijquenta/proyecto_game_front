import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Product } from '../../api/product';
import { ProductService } from '../../service/examples/product.service';
import { Subscription } from 'rxjs';
import { LayoutService } from 'src/app/modules/layout/service/app.layout.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/services/auth.service';
import { Usuario } from '../../models/usuario';
import { PrincipalService } from '../../service/data/principal.service';
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


    basicData: any;

    basicOptions: any;


    data: any;

    options: any;

    data2: any;

    options2: any;


    data3: any;

    options3: any;

    data4: any;

    options4: any;

    data5: any;
    options5: any;

    data6: any;
    options6: any;

    data7: any;
    options7: any;

    data8: any;
    options8: any;


    dataEstudiantesMateria: any;
    optionsEstudiantesMateria: any;

    dataEstudiantesNivel: any;
    optionsEstudiantesNivel: any;

    data9: any;
    options9: any;

    data10: any;
    options10: any;

    listaCantidades: any;
    curmatnum: number | null = null;
    matnum: number | null = null;
    nivnum: number | null = null;
    usunum: number | null = null;
    estnum: number | null = null;
    docnum: number | null = null;
    secnum: number | null = null;
    texnum: number | null = null;
    curmatnum_inactivo: number | null = null;
    matnum_inactivo: number | null = null;
    nivnum_inactivo: number | null = null;
    usunum_inactivo: number | null = null;
    estnum_inactivo: number | null = null;
    docnum_inactivo: number | null = null;
    secnum_inactivo: number | null = null;
    texnum_inactivo: number | null = null;

    listaEstudiantesMateria: any;
    listaEstudiantesNivel: any;
    constructor(private productService: ProductService,
                        public layoutService: LayoutService,
                        private spinner: NgxSpinnerService,
                        private principalService: PrincipalService,
                        private authService: AuthService) {
        this.subscription = this.layoutService.configUpdate$.subscribe(() => {
            this.initChart();
        });
    }

    ngOnInit() {
        this.initChart();
        this.initChart2();
        this.initChart3();
        this.initChart4();
        this.initChart5();
        this.initChart6();
        this.initChart7();
        this.initChart8();
        this.initChart9();
        this.initChart10();
        this.initChart11();


        // this.productService.getProductsSmall().then(data => this.products = data);

        this.items = [
            { label: 'Add New', icon: 'pi pi-fw pi-plus' },
            { label: 'Remove', icon: 'pi pi-fw pi-minus' }
        ];
        this.spinner.show();
        this.authService.usuario$.subscribe(
          (user: any) => {
            if (user) {
              if (Array.isArray(user) && user.length > 0) {
                this.usuario = user[0];
                this.spinner.hide();
              }
            }
          },
          (error: any) => {
            console.error("Error al obtener el usuario:", error);
            this.spinner.hide();
          },
        );
        // Llama al servicio y asigna los valores a las variables correspondientes
        this.principalService.listarCantidades().subscribe(
            (data: any[]) => {
                this.listaCantidades = data;
                console.log(this.listaCantidades)

                // Asigna los valores de cada campo a las variables correspondientes
                this.curmatnum = this.listaCantidades[0]['curmatnum'];
                this.matnum = this.listaCantidades[0]['matnum'];
                this.nivnum = this.listaCantidades[0]['nivnum'];
                this.usunum = this.listaCantidades[0]['usunum'];
                this.estnum = this.listaCantidades[0]['estnum'];
                this.docnum = this.listaCantidades[0]['docnum'];
                this.secnum = this.listaCantidades[0]['secnum'];
                this.texnum = this.listaCantidades[0]['texnum'];

                this.curmatnum_inactivo = this.listaCantidades[0]['curmatnumInactivos'];
                this.matnum_inactivo = this.listaCantidades[0]['matnumInactivos'];
                this.nivnum_inactivo = this.listaCantidades[0]['nivnumInactivos'];
                this.usunum_inactivo = this.listaCantidades[0]['usunumInactivos'];
                this.estnum_inactivo = this.listaCantidades[0]['estnumInactivos'];
                this.docnum_inactivo = this.listaCantidades[0]['docnumInactivos'];
                this.secnum_inactivo = this.listaCantidades[0]['secnumInactivos'];
                this.texnum_inactivo = this.listaCantidades[0]['texnumInactivos'];
                // this.spinner.hide();
                this.initChart();
            },
            (error: any) => {
                console.error("Error al obtener la cantidad:", error);
                // this.spinner.hide();
            }
        );

        this.principalService.listarEstudiantesMateria().subscribe(
            (data: any) => {
                this.listaEstudiantesMateria = data;
                console.log(this.listaEstudiantesMateria)
                this.spinner.hide();
                this.initChartEstudiantesMateria();
            },
            (error: any) => {
                console.error("Error al obtener la cantidad:", error);
                this.spinner.hide();
            }
        );

        this.principalService.listarEstudiantesNivel().subscribe(
            (data: any) => {
                this.listaEstudiantesNivel = data;
                console.log(this.listaEstudiantesNivel)
                this.spinner.hide();
                this.initChartEstudiantesNivel();
            },
            (error: any) => {
                console.error("Error al obtener la cantidad:", error);
                this.spinner.hide();
            }
        )
    }

    initChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        this.basicData = {
            labels: ['Estudiantes', 'Docentes', 'Invitados'],
            datasets: [
                {
                    label: ['Usuarios'],
                    data: [this.estnum,this.docnum,this.secnum],
                    backgroundColor: ['rgba(255, 259, 64, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(153, 102, 255, 0.2)'],
                    borderColor: ['rgb(255, 259, 64)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)'],
                    borderWidth: 1
                },
                // {
                //     label: ['Docentes'],
                //     data: [0, 129, 0],
                //     backgroundColor: ['rgba(255, 159, 64, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(153, 102, 255, 0.2)'],
                //     borderColor: ['rgb(255, 159, 64)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)'],
                //     borderWidth: 1
                // },

                // {
                //     label: ['Invitados'],
                //     data: [0, 0, 30],
                //     backgroundColor: ['rgba(255, 59, 64, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(153, 102, 255, 0.2)'],
                //     borderColor: ['rgb(255, 59, 64)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)'],
                //     borderWidth: 1
                // },
            ]
        };

        this.basicOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                x: {
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
    initChart2() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');

        this.data = {
            labels: ['Estudiantes', 'Docentes', 'Invitados'],
            datasets: [
                {
                    data: [240, 25, 30],
                    backgroundColor: [documentStyle.getPropertyValue('--blue-500'), documentStyle.getPropertyValue('--yellow-500'), documentStyle.getPropertyValue('--green-500')],
                    hoverBackgroundColor: [documentStyle.getPropertyValue('--blue-400'), documentStyle.getPropertyValue('--yellow-400'), documentStyle.getPropertyValue('--green-400')]
                }
            ]
        };

        this.options = {
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true,
                        color: textColor
                    }
                }
            }
        };
    }

    initChart3(){
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        this.data2 = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'My First dataset',
                    backgroundColor: documentStyle.getPropertyValue('--blue-500'),
                    borderColor: documentStyle.getPropertyValue('--blue-500'),
                    data: [65, 59, 80, 81, 56, 55, 40]
                },
                {
                    label: 'My Second dataset',
                    backgroundColor: documentStyle.getPropertyValue('--pink-500'),
                    borderColor: documentStyle.getPropertyValue('--pink-500'),
                    data: [28, 48, 40, 19, 86, 27, 90]
                }
            ]
        };

        this.options2 = {
            maintainAspectRatio: false,
            aspectRatio: 0.8,
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
                        color: textColorSecondary,
                        font: {
                            weight: 500
                        }
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
        }
    }

    initChart4(){
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        this.data3 = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'My First dataset',
                    backgroundColor: documentStyle.getPropertyValue('--blue-500'),
                    borderColor: documentStyle.getPropertyValue('--blue-500'),
                    data: [65, 59, 80, 81, 56, 55, 40]
                },
                {
                    label: 'My Second dataset',
                    backgroundColor: documentStyle.getPropertyValue('--pink-500'),
                    borderColor: documentStyle.getPropertyValue('--pink-500'),
                    data: [28, 48, 40, 19, 86, 27, 90]
                }
            ]
        };

        this.options3 = {
            indexAxis: 'y',
            maintainAspectRatio: false,
            aspectRatio: 0.8,
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
                        color: textColorSecondary,
                        font: {
                            weight: 500
                        }
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
        }

    }

    initChart5(){
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        this.data4 = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    type: 'bar',
                    label: 'Dataset 1',
                    backgroundColor: documentStyle.getPropertyValue('--blue-500'),
                    data: [50, 25, 12, 48, 90, 76, 42]
                },
                {
                    type: 'bar',
                    label: 'Dataset 2',
                    backgroundColor: documentStyle.getPropertyValue('--green-500'),
                    data: [21, 84, 24, 75, 37, 65, 34]
                },
                {
                    type: 'bar',
                    label: 'Dataset 3',
                    backgroundColor: documentStyle.getPropertyValue('--yellow-500'),
                    data: [41, 52, 24, 74, 23, 21, 32]
                }
            ]
        };

        this.options4 = {
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                tooltips: {
                    mode: 'index',
                    intersect: false
                },
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    stacked: true,
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                y: {
                    stacked: true,
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

    initChart6(){
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        this.data5 = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'First Dataset',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    fill: false,
                    borderColor: documentStyle.getPropertyValue('--blue-500'),
                    tension: 0.4
                },
                {
                    label: 'Second Dataset',
                    data: [28, 48, 40, 19, 86, 27, 90],
                    fill: false,
                    borderColor: documentStyle.getPropertyValue('--pink-500'),
                    tension: 0.4
                }
            ]
        };

        this.options5 = {
            maintainAspectRatio: false,
            aspectRatio: 0.6,
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

    initChart7(){
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        this.data6 = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'Dataset 1',
                    fill: false,
                    borderColor: documentStyle.getPropertyValue('--blue-500'),
                    yAxisID: 'y',
                    tension: 0.4,
                    data: [65, 59, 80, 81, 56, 55, 10]
                },
                {
                    label: 'Dataset 2',
                    fill: false,
                    borderColor: documentStyle.getPropertyValue('--green-500'),
                    yAxisID: 'y1',
                    tension: 0.4,
                    data: [28, 48, 40, 19, 86, 27, 90]
                }
            ]
        };

        this.options6 = {
            stacked: false,
            maintainAspectRatio: false,
            aspectRatio: 0.6,
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
                        color: surfaceBorder
                    }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        drawOnChartArea: false,
                        color: surfaceBorder
                    }
                }
            }
        };
    }

    initChart8(){
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        this.data7 = {
            labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
            datasets: [
                // {
                //     label: 'First Dataset',
                //     data: [65, 59, 80, 81, 56, 55, 40],
                //     fill: false,
                //     tension: 0.4,
                //     borderColor: documentStyle.getPropertyValue('--blue-500')
                // },
                // {
                //     label: 'Second Dataset',
                //     data: [28, 48, 40, 19, 86, 27, 90],
                //     fill: false,
                //     borderDash: [5, 5],
                //     tension: 0.4,
                //     borderColor: documentStyle.getPropertyValue('--teal-500')
                // },
                {
                    label: 'Pago de materia',
                    data: [12, 51, 62, 33, 21, 62, 45,43, 12, 53, 12,100],
                    fill: true,
                    borderColor: documentStyle.getPropertyValue('--orange-500'),
                    tension: 0.4,
                    backgroundColor: 'rgba(255,167,38,0.2)'
                }
            ]
        };

        this.options7 = {
            maintainAspectRatio: false,
            aspectRatio: 0.6,
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
                        color: surfaceBorder
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    }
                }
            }
        };
    }

    initChart9(){
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        this.data8 = {
            datasets: [
                {
                    data: [30, 42, 17, 23, 14],
                    backgroundColor: [
                        documentStyle.getPropertyValue('--red-500'),
                        documentStyle.getPropertyValue('--green-500'),
                        documentStyle.getPropertyValue('--yellow-500'),
                        documentStyle.getPropertyValue('--bluegray-500'),
                        documentStyle.getPropertyValue('--blue-500')
                    ],
                    label: 'My dataset'
                }
            ],
            labels: ['Libro de Romano', 'Homilética Básica', 'Como estudiar la Biblia', 'Primera de Corintios', 'Enseñanza expositiva ']
        };

        this.options8 = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                r: {
                    grid: {
                        color: surfaceBorder
                    }
                }
            }
        };
    }

    initChart10(){
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');

        this.data9 = {
            labels: ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'],
            datasets: [
                {
                    label: 'My First dataset',
                    borderColor: documentStyle.getPropertyValue('--bluegray-400'),
                    pointBackgroundColor: documentStyle.getPropertyValue('--bluegray-400'),
                    pointBorderColor: documentStyle.getPropertyValue('--bluegray-400'),
                    pointHoverBackgroundColor: textColor,
                    pointHoverBorderColor: documentStyle.getPropertyValue('--bluegray-400'),
                    data: [65, 59, 90, 81, 56, 55, 40]
                },
                {
                    label: 'My Second dataset',
                    borderColor: documentStyle.getPropertyValue('--pink-400'),
                    pointBackgroundColor: documentStyle.getPropertyValue('--pink-400'),
                    pointBorderColor: documentStyle.getPropertyValue('--pink-400'),
                    pointHoverBackgroundColor: textColor,
                    pointHoverBorderColor: documentStyle.getPropertyValue('--pink-400'),
                    data: [28, 48, 40, 19, 96, 27, 100]
                }
            ]
        };

        this.options9 = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                r: {
                    grid: {
                        color: textColorSecondary
                    },
                    pointLabels: {
                        color: textColorSecondary
                    }
                }
            }
        };
    }

    initChart11(){
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        this.data10 = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    type: 'line',
                    label: 'Dataset 1',
                    borderColor: documentStyle.getPropertyValue('--blue-500'),
                    borderWidth: 2,
                    fill: false,
                    tension: 0.4,
                    data: [50, 25, 12, 48, 56, 76, 42]
                },
                {
                    type: 'bar',
                    label: 'Dataset 2',
                    backgroundColor: documentStyle.getPropertyValue('--green-500'),
                    data: [21, 84, 24, 75, 37, 65, 34],
                    borderColor: 'white',
                    borderWidth: 2
                },
                {
                    type: 'bar',
                    label: 'Dataset 3',
                    backgroundColor: documentStyle.getPropertyValue('--orange-500'),
                    data: [41, 52, 24, 74, 23, 21, 32]
                }
            ]
        };

        this.options10 = {
            maintainAspectRatio: false,
            aspectRatio: 0.6,
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
                        color: surfaceBorder
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
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



    initChartEstudiantesMateria() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        // Función para generar una paleta de colores dinámica
        const dynamicColors = () => {
            const colors = [
                '--red-500',
                '--green-500',
                '--yellow-500',
                '--bluegray-500',
                '--blue-500',
                // Agrega más colores si es necesario
            ];
            return colors.map(color => documentStyle.getPropertyValue(color));
        };

        // Arreglos para almacenar los datos, etiquetas y colores de fondo
        let dataEstudiantes = [];
        let labels = [];
        let backgroundColors = [];

        // Iterar sobre los datos de la listaEstudiantesMateria
        for (let i = 0; i < this.listaEstudiantesMateria.length; i++) {
            dataEstudiantes.push(this.listaEstudiantesMateria[i].cantidadEstudiantes);
            labels.push(this.listaEstudiantesMateria[i].matnombre);
            backgroundColors.push(dynamicColors()[i % dynamicColors().length]); // Usar módulo para repetir los colores
        }

        // Asignar datos, etiquetas y colores al gráfico
        this.dataEstudiantesMateria = {
            datasets: [
                {
                    data: dataEstudiantes,
                    backgroundColor: backgroundColors,
                    label: 'My dataset'
                }
            ],
            labels: labels
        };

        // Configuración de opciones del gráfico
        this.optionsEstudiantesMateria = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                r: {
                    grid: {
                        color: surfaceBorder
                    }
                }
            }
        };
    }
    initChartEstudiantesNivel() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');

        // Arreglo vacío para almacenar los datos y etiquetas
        let dataEstudiantes = [];
        let labels = [];

        // Iterar sobre los datos obtenidos de la consulta
        for (let i = 0; i < this.listaEstudiantesNivel.length; i++) {
            // Determinar la etiqueta del nivel
            let nivelLabel = '';
            switch (this.listaEstudiantesNivel[i].curnivel) {
                case 1:
                    nivelLabel = 'Primer Nivel';
                    break;
                case 2:
                    nivelLabel = 'Segundo Nivel';
                    break;
                case 3:
                    nivelLabel = 'Tercer Nivel';
                    break;
                default:
                    nivelLabel = 'Otro Nivel';
            }
            // Agregar la cantidad de estudiantes y el nivel a los arreglos
            dataEstudiantes.push(this.listaEstudiantesNivel[i].cantidadEstudiantes);
            labels.push(nivelLabel);
        }

        // Asignar los arreglos a this.data
        this.dataEstudiantesNivel = {
            labels: labels,
            datasets: [
                {
                    data: dataEstudiantes,
                    backgroundColor: [
                        documentStyle.getPropertyValue('--blue-500'),
                        documentStyle.getPropertyValue('--yellow-500'),
                        documentStyle.getPropertyValue('--green-500'),
                        documentStyle.getPropertyValue('--red-500')
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--blue-400'),
                        documentStyle.getPropertyValue('--yellow-400'),
                        documentStyle.getPropertyValue('--green-400'),
                        documentStyle.getPropertyValue('--red-400')
                    ]
                }
            ]
        };

        // Opciones del gráfico
        this.optionsEstudiantesNivel = {
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true,
                        color: textColor
                    }
                }
            }
        };
    }


}
