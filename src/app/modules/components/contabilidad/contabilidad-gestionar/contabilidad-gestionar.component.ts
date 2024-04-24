import { Component, OnInit, ViewChild } from '@angular/core';
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
// --------------- Inportando el servicio de reportes pdf
import { ReporteService } from 'src/app/modules/service/data/reporte.service';
// --------------- Modelo Usuario
import { Usuario } from 'src/app/modules/models/usuario';
// --------------- Importación de Autenticación
import { AuthService } from 'src/app/services/auth.service';

import { NgxSpinnerService } from 'ngx-spinner';

import { environment } from 'src/environments/environment';

import { ContabilidadService } from 'src/app/modules/service/data/contabilidad.service';

import { ChangeDetectorRef } from '@angular/core';

interface ResumenFinanciero {
    id: number;
    resdescripcion: string;
    resmonto: number;
    color:string;
}

@Injectable({
    providedIn: 'root',
})


@Component({
    templateUrl: './contabilidad-gestionar.component.html',
    styleUrls: ['../../../../app.component.css']
})


export class ContabilidadGestionarComponent implements OnInit {

    criterio: any = '';
    loading: boolean = false;
    loading2: boolean = false;
    errors: any;
    usuario: Usuario;
    apiUrl = environment.API_URL_FOTO_PERFIL;
    // Datos para contabilidad
    ingresos!: any[];
    ingresos2: any[] = [];
    descuentos!: any[];
    resumen!: any[];
    ingresosTotal!: number;
    descuentosTotal!: number;
    numAlumnos!: number;
    fechaInicioSelected: any;
    fechaFinSelected: any;
    resumenFinanciero: ResumenFinanciero[] = [];
    clonedResumen: { [s: string]: ResumenFinanciero } = {};
    desnombre: any;
    desdescripcion: any;
    desmonto: any;
    descuentoDialog: boolean = false;
    constructor(
        private messageService: MessageService,
        public reporte: ReporteService,
        private authService: AuthService,
        private spinner: NgxSpinnerService,
        public contabilidadService: ContabilidadService,
        private cdr: ChangeDetectorRef
    ) {
    }
    ngOnInit(): void {

        this.descuentos = [
            { desnombre: 'Pago licencia Zoom', desdescripcion: 'descripcion', desmonto: 110 },
            { desnombre: 'Gastos diversos', desdescripcion: 'descripcion', desmonto: 140 }
        ];

        this.resumen = [
            { resdescripcion: 'Total de Ingresos', resmonto: 0 },
            { resdescripcion: 'Total de Egresos', resmonto: 0 },
            { resdescripcion: 'Diferencia', resmonto: 0 },
            { resdescripcion: '50% de valor Pr. Hugo Carrasco', resmonto: 0 },
            { resdescripcion: 'Diferencia de alumnanos Pr. Hugo Carrasco', resmonto: 0 },
        ];
        this.getPerfilUsuario();
    }
    onRowEditInit(item: ResumenFinanciero) {
        this.clonedResumen[item.id] = { ...item };
    }

    onRowEditSave(item: ResumenFinanciero) {
        if (item.resmonto > 0) {
            delete this.clonedResumen[item.id];
            this.messageService.add({ severity: 'success', summary: 'Información', detail: 'Registro guardado correctamente' });
        }
        else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El valor debe ser mayor a 0' });
        }
    }

    onRowEditCancel(item: ResumenFinanciero, index: number) {
        this.resumenFinanciero[index] = this.clonedResumen[item.id];
        delete this.clonedResumen[item.id];
    }

    calcularTotalIngreso() {
        let total = 0;
        for (let des of this.ingresos2) {
            total += (des.numeroEstudiantes * des.curmatcosto);
        }
        this.ingresosTotal = total;
    }

    calcularTotalDescuento() {
        let total = 0;
        for (let des of this.descuentos) {
            total += (des.desmonto);
        }
        this.descuentosTotal = total;
    }

    calcularTotalDescuentov2(descuentos: any) {
        let total = 0;
        for (let des of descuentos) {
            total += (des.desmonto);
        }
        this.descuentosTotal = total;
    }

    calcularTotalAlumnos() {
        let total = 0;
        for (let ing of this.ingresos2) {
            total += ing['numeroEstudiantes'];
        }
        this.numAlumnos = total;
    }

    calcularDiferencia() {
        return this.ingresosTotal - this.descuentosTotal;
    }

    calcularPorcentajeAdolfoAlyne(): number {
        return this.calcularDiferencia() * 0.5; // 50% del valor Prs. Adolfo & Alyne
    }
    calcularDiferenciaHugoCarrasco(): number {
        return this.calcularDiferencia() * 0.5; // 50% de la diferencia
    }
    calcularPorcentajeDirectoresIBCI(): number {
        // Lógica para calcular el 50% de los directores IBCI
        return 1; // Reemplaza este valor con tu lógica de cálculo
    }


    // Obtener datos del perfil del usuario logeado
    getPerfilUsuario() {
        this.spinner.show();
        this.authService.getPerfil().subscribe(usuario => {
            this.usuario = usuario[0];
            this.spinner.hide();
        },
            (error: any) => {
                this.errors = error;
                this.spinner.hide();
                console.log("error", error);
                this.messageService.add({ severity: 'warn', summary: 'Error', detail: 'Algo salió mal!' });
            }
        );
    }
    obtenerInformacion() {
        if(this.fechaInicioSelected == null || this.fechaFinSelected == null){
            this.messageService.add({ severity: 'warn', summary: 'Error', detail: 'Seleccione las fechas' });
            return;
        }
        const criterio = {
            fecini: this.fechaInicioSelected,
            fecfin: this.fechaFinSelected
        }
        this.contabilidadService.listarCursoMateriaContabilidad(criterio).subscribe(
            (data: any[]) => {
                this.ingresos2 = data;
                this.calcularTotalIngreso();
                this.calcularTotalAlumnos();
                this.calcularTotalDescuento();
                this.calcularDiferencia();
                this.calcularPorcentajeAdolfoAlyne();
                this.calcularDiferenciaHugoCarrasco();
                this.calcularPorcentajeDirectoresIBCI();
                this.resumenFinanciero = [
                    { id: 1, resdescripcion: 'Total de Ingresos', resmonto: this.ingresosTotal, color: 'info' },
                    { id: 2, resdescripcion: 'Total de Egresos', resmonto: this.descuentosTotal, color: 'danger' },
                    { id: 3, resdescripcion: 'Diferencia', resmonto: this.ingresosTotal - this.descuentosTotal, color: 'success' },
                    { id: 4, resdescripcion: 'Porcentaje Director General', resmonto: (this.ingresosTotal - this.descuentosTotal) / 2, color: 'info' },
                    { id: 5, resdescripcion: 'Porcentaje Director IBCI', resmonto: (this.ingresosTotal - this.descuentosTotal) / 2, color: 'info' }
                ];
            },
            (error: any) => {
                this.errors = error;
                console.log("error", error);
                this.messageService.add({ severity: 'warn', summary: 'Error', detail: 'Algo salió mal!' });
            }
        );
    }
    nuevoDescuento(){
        this.descuentoDialog = true;
    }
    ocultarDialog(){
        this.descuentoDialog = false;
    }
    adicionarDescuento(desnombre, desdescripcion, desmonto){
        const nuevoDescuento = {
            desnombre: desnombre,
            desdescripcion: desdescripcion,
            desmonto: desmonto
        };
        this.descuentos.push(nuevoDescuento);
        this.messageService.add({ severity: 'success', summary: 'Información', detail: 'Registro guardado correctamente' });
        this.cdr.detectChanges();
        this.desnombre = null;
        this.desdescripcion = null;
        this.desmonto = null;
        this.descuentoDialog = false;
        this.calcularTotalDescuentov2(this.descuentos);
        this.calcularDiferencia();
        this.resumenFinanciero = [
            { id: 1, resdescripcion: 'Total de Ingresos', resmonto: this.ingresosTotal, color: 'info' },
            { id: 2, resdescripcion: 'Total de Egresos', resmonto: this.descuentosTotal, color: 'danger' },
            { id: 3, resdescripcion: 'Diferencia', resmonto: this.ingresosTotal - this.descuentosTotal, color: 'success' },
            { id: 4, resdescripcion: 'Porcentaje Director General', resmonto: (this.ingresosTotal - this.descuentosTotal) / 2, color: 'info' },
            { id: 5, resdescripcion: 'Porcentaje Director IBCI', resmonto: (this.ingresosTotal - this.descuentosTotal) / 2, color: 'info' }
        ];
    }
}
