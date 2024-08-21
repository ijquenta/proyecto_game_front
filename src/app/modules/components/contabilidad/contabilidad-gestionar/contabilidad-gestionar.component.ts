import { Component, OnInit, ViewChild } from '@angular/core';
import { Injectable } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { ReporteService } from 'src/app/modules/service/data/reporte.service';
import { Usuario } from 'src/app/modules/models/usuario';
import { AuthService } from 'src/app/modules/service/core/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import { ContabilidadService } from 'src/app/modules/service/data/contabilidad.service';
import { ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TipoCurso2, TipoMateriaCombo } from 'src/app/modules/models/diccionario';
import { CursoService } from 'src/app/modules/service/data/curso.service';
import { Table } from 'primeng/table';

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
    styleUrls: ['../../../../app.component.css'],
})
export class ContabilidadGestionarComponent implements OnInit {
    @ViewChild('dt') dt: Table;
    criterio: any = '';
    loading: boolean = false;
    loading2: boolean = false;
    errors: any;
    usuario: Usuario;
    ingresos!: any[];
    cursoMateria: any[] = [];
    cursomateria: any;
    descuentos!: any[];
    resumen!: any[];
    ingresos_total!: number;
    descuentos_total!: number;
    numero_estudiantes!: number;
    fechaInicioSelected: any;
    fechaFinSelected: any;
    resumenFinanciero: ResumenFinanciero[] = [];
    clonedResumen: { [s: string]: ResumenFinanciero } = {};
    desnombre: any;
    desdescripcion: any;
    desmonto: any;
    descuentoDialog: boolean = false;
    tipoCurso: TipoCurso2[] = [];
    tipoMateria: TipoMateriaCombo[] = [];
    items: MenuItem[];
    home: MenuItem | undefined;

    dateForm: FormGroup;
    cursoMateriaForm: FormGroup;
    descuentoForm: FormGroup;
    cursoMateriaSidebar: boolean = false;
    descuentoOption: boolean = false;

    item: any;

    constructor(
        private messageService: MessageService,
        public reporte: ReporteService,
        private authService: AuthService,
        private spinner: NgxSpinnerService,
        public contabilidadService: ContabilidadService,
        private cdr: ChangeDetectorRef,
        private formBuilder: FormBuilder,
        private cursoService: CursoService
    ) {
        this.items = [
            { label: 'Contabilidad' },
            { label: 'Informe Financiero', routerLink: '' },
        ];
        this.home = { icon: 'pi pi-home', routerLink: '/principal' };
    }
    ngOnInit(): void {
        this.descuentos = [
            {
                desnombre: 'Pago licencia Zoom',
                desdescripcion: 'descripcion',
                desmonto: 110,
            },
            {
                desnombre: 'Gastos diversos',
                desdescripcion: 'descripcion',
                desmonto: 140,
            },
        ];

        this.resumen = [
            { resdescripcion: 'Total de Ingresos', resmonto: 0 },
            { resdescripcion: 'Total de Egresos', resmonto: 0 },
            { resdescripcion: 'Diferencia', resmonto: 0 },
            { resdescripcion: '50% de valor Pr. Hugo Carrasco', resmonto: 0 },
            {
                resdescripcion: 'Diferencia de alumnanos Pr. Hugo Carrasco',
                resmonto: 0,
            },
        ];
        this.getProfileUsuario();
        this.initializeValidation();
        this.asignacionValidacionesInscripcion();
        this.obtenerTipoCurso();
    }
    addItem() {
        // Verificar si el formulario es válido
        if (this.cursoMateriaForm.invalid) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error en el Registro',
                detail: 'Por favor, verifica la información ingresada e intenta nuevamente.',
                life: 3000,
            });
            Object.values(this.cursoMateriaForm.controls).forEach((control) => {
                control.markAllAsTouched();
                control.markAsDirty();
            });
            return;
        }

        // Traer información faltante
        const criterio = {
            curid: this.cursoMateriaForm.value.tipoCurso.curid,
            matid: this.cursoMateriaForm.value.tipoMateria.matid,
        };

        this.spinner.show();
        this.contabilidadService
            .getListCursoMateriaContabilidadById(criterio)
            .subscribe({
                next: (result: any) => {
                    this.spinner.hide();
                    this.cursomateria = result[0];

                    // Verificar si el elemento ya existe en la lista
                    const exists = this.cursoMateria.some(
                        (cm: any) =>
                            cm.curid === this.cursomateria.curid &&
                            cm.curmatid === this.cursomateria.curmatid
                    );

                    if (exists) {
                        this.messageService.add({
                            severity: 'warn',
                            summary: 'Registro Existente',
                            detail: 'El registro ya existe en la lista.',
                            life: 3000,
                        });
                    } else {
                        // Agregar el elemento a la lista después de recibir los datos
                        this.addListCursoMateria(this.cursomateria);
                    }
                },
                error: (error: any) => {
                    this.loading = false;
                    this.spinner.hide();
                    console.error(error);
                },
            });
    }

    addListCursoMateria(item: any) {
        this.cursoMateria = [...this.cursoMateria, item];
        this.cdr.detectChanges();
        this.dt.reset();

        this.calcularTotales();

        this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Materia agregada exitosamente.',
            life: 3000,
        });

        this.cursoMateriaSidebar = false;
    }

    deleteItem(item: any) {
        // Encontrar el índice del elemento en la lista cursoMateria
        const index = this.cursoMateria.findIndex(
            (cm: any) =>
                cm.curid === item.curid && cm.curmatid === item.curmatid
        );

        // Verificar si el elemento existe en la lista
        if (index !== -1) {
            // Eliminar el elemento de la lista
            this.cursoMateria.splice(index, 1);

            // Asignar una nueva referencia al array para forzar la detección de cambios
            this.cursoMateria = [...this.cursoMateria];

            this.calcularTotales();

            this.messageService.add({
                severity: 'success',
                summary: 'Exito',
                detail: 'Materia eliminada exitosamente.',
                life: 3000,
            });

            this.cursoMateriaSidebar = false;
            this.cursoMateriaForm.reset();
        } else {
            console.error('Item not found in cursoMateria');
        }
    }

    onSelectCurso(data: any) {
        const curid = parseInt(data.value.curid);
        this.obtenerTipoMateria(curid);
    }

    obtenerTipoMateria(criterio: any) {
        this.spinner.show();
        this.cursoService.getTipoMateriaByCursoId(criterio).subscribe({
            next: (result: any) => {
                this.spinner.hide();
                this.tipoMateria = result['data'];
            },
            error: (error: any) => {
                this.loading = false;
                this.spinner.hide();
                console.error(error);
            },
        });
    }

    asignacionValidacionesInscripcion() {
        this.cursoMateriaForm = this.formBuilder.group({
            tipoCurso: ['', [Validators.required]],
            tipoMateria: ['', [Validators.required]],
        });

        this.descuentoForm = this.formBuilder.group({
            desnombre: ['', [Validators.required]],
            desdescripcion: ['', [Validators.required]],
            desmonto: ['', [Validators.required]],
        });
    }

    initializeValidation() {
        this.dateForm = this.formBuilder.group({
            startDate: ['', [Validators.required]],
            endDate: ['', [Validators.required]],
        });
    }

    // Método para obtener los tipos de cursos
    obtenerTipoCurso() {
        this.cursoService.getTipoCurso().subscribe((result: any) => {
            this.tipoCurso = result;
        });
    }

    addCursoMateria() {
        this.cursoMateriaSidebar = true;
        this.cursoMateriaForm.reset();
    }

    calcularTotales() {
        this.calcularTotalIngreso();
        this.calcularTotalAlumnos();
        this.calcularTotalDescuento();
        this.calcularDiferencia();
        this.calcularPorcentajeAdolfoAlyne();
        this.calcularDiferenciaHugoCarrasco();
        this.calcularPorcentajeDirectoresIBCI();
        this.resumenFinanciero = [
            {
                id: 1,
                resdescripcion: 'Total de Ingresos',
                resmonto: this.ingresos_total,
                color: 'info',
            },
            {
                id: 2,
                resdescripcion: 'Total de Egresos',
                resmonto: this.descuentos_total,
                color: 'danger',
            },
            {
                id: 3,
                resdescripcion: 'Diferencia',
                resmonto: this.ingresos_total - this.descuentos_total,
                color: 'success',
            },
            {
                id: 4,
                resdescripcion: 'Porcentaje Director General',
                resmonto: (this.ingresos_total - this.descuentos_total) / 2,
                color: 'info',
            },
            {
                id: 5,
                resdescripcion: 'Porcentaje Director IBCI',
                resmonto: (this.ingresos_total - this.descuentos_total) / 2,
                color: 'info',
            },
        ];
    }

    searchInformation() {
        if (this.dateForm.invalid) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Por favor, verifica la información ingresada e intenta nuevamente.',
                life: 3000,
            });
            Object.values(this.dateForm.controls).forEach((control) => {
                control.markAllAsTouched();
                control.markAsDirty();
            });
            return;
        }

        const criterio = {
            fecini: this.dateForm.value.startDate,
            fecfin: this.dateForm.value.endDate,
        };
        this.spinner.show();
        this.contabilidadService
            .listarCursoMateriaContabilidad(criterio)
            .subscribe(
                (data: any[]) => {
                    this.cursoMateria = data;
                    this.calcularTotales();

                    this.messageService.add({
                        severity: 'success',
                        summary: 'Exito',
                        detail: 'Información obtenida exitosamente.',
                        life: 3000,
                    });
                    this.spinner.hide();
                },
                (error: any) => {
                    this.errors = error;
                    this.messageService.add({
                        severity: 'warn',
                        summary: 'Error',
                        detail: 'Algo salió mal!',
                    });
                    this.spinner.hide();
                }
            );
    }

    onRowEditInit(item: ResumenFinanciero) {
        this.clonedResumen[item.id] = { ...item };
    }

    onRowEditSave(item: ResumenFinanciero) {
        if (item.resmonto > 0) {
            delete this.clonedResumen[item.id];
            this.messageService.add({
                severity: 'success',
                summary: 'Información',
                detail: 'Registro guardado correctamente',
            });
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'El valor debe ser mayor a 0',
            });
        }
    }

    onRowEditCancel(item: ResumenFinanciero, index: number) {
        this.resumenFinanciero[index] = this.clonedResumen[item.id];
        delete this.clonedResumen[item.id];
    }

    calcularTotalIngreso() {
        let total = 0;
        for (let des of this.cursoMateria) {
            total += des.numero_estudiantes * des.curmatcosto;
        }
        this.ingresos_total = total;
    }

    calcularTotalDescuento() {
        let total = 0;
        for (let des of this.descuentos) {
            total += des.desmonto;
        }
        this.descuentos_total = total;
    }

    calcularTotalDescuentov2(descuentos: any) {
        let total = 0;
        for (let des of descuentos) {
            total += des.desmonto;
        }
        this.descuentos_total = total;
    }

    calcularTotalAlumnos() {
        let total = 0;
        for (let ing of this.cursoMateria) {
            total += ing['numero_estudiantes'];
        }
        this.numero_estudiantes = total;
    }

    calcularDiferencia() {
        return this.ingresos_total - this.descuentos_total;
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
    getProfileUsuario() {
        this.spinner.show();
        this.authService.getProfile().subscribe(
            (usuario) => {
                this.usuario = usuario[0];
                this.spinner.hide();
            },
            (error: any) => {
                this.errors = error;
                this.spinner.hide();
                console.error('error', error);
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Error',
                    detail: 'Algo salió mal!',
                });
            }
        );
    }

    nuevoDescuento() {
        this.descuentoDialog = true;
        this.descuentoOption = true;
    }

    ocultarDialog() {
        this.descuentoDialog = false;
        this.descuentoOption = true;
    }

    adicionarDescuento() {
        if (this.descuentoForm.invalid) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error en el Registro',
                detail: 'Por favor, verifica la información ingresada e intenta nuevamente.',
                life: 3000,
            });
            Object.values(this.descuentoForm.controls).forEach((control) => {
                control.markAllAsTouched();
                control.markAsDirty();
            });
            return;
        }

        const nuevoDescuento = {
            desnombre: this.descuentoForm.value.desnombre,
            desdescripcion: this.descuentoForm.value.desdescripcion,
            desmonto: this.descuentoForm.value.desmonto,
        };
        this.descuentos.push(nuevoDescuento);
        this.messageService.add({
            severity: 'success',
            summary: 'Información',
            detail: 'Registro guardado correctamente',
        });
        this.cdr.detectChanges();
        this.desnombre = null;
        this.desdescripcion = null;
        this.desmonto = null;
        this.descuentoDialog = false;
        this.calcularDescuento();
        this.descuentoForm.reset();
    }

    calcularDescuento() {
        this.calcularTotalDescuentov2(this.descuentos);
        this.calcularDiferencia();
        this.resumenFinanciero = [
            {
                id: 1,
                resdescripcion: 'Total de Ingresos',
                resmonto: this.ingresos_total,
                color: 'info',
            },
            {
                id: 2,
                resdescripcion: 'Total de Egresos',
                resmonto: this.descuentos_total,
                color: 'danger',
            },
            {
                id: 3,
                resdescripcion: 'Diferencia',
                resmonto: this.ingresos_total - this.descuentos_total,
                color: 'success',
            },
            {
                id: 4,
                resdescripcion: 'Porcentaje Director General',
                resmonto: (this.ingresos_total - this.descuentos_total) / 2,
                color: 'info',
            },
            {
                id: 5,
                resdescripcion: 'Porcentaje Director IBCI',
                resmonto: (this.ingresos_total - this.descuentos_total) / 2,
                color: 'info',
            },
        ];
    }

    modDescuento(item: any) {
        this.descuentoDialog = true;
        this.descuentoOption = false;
        // Establecer item con una copia del objeto pasado
        this.item = { ...item };

        // Rellenar el formulario con la información del descuento
        this.descuentoForm.setValue({
            desnombre: this.item.desnombre || '',
            desdescripcion: this.item.desdescripcion || '',
            desmonto: this.item.desmonto || '',
        });
    }

    updateDescuento() {
        // Verificar si el formulario es válido
        if (this.descuentoForm.invalid) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error en la Actualización',
                detail: 'Por favor, verifica la información ingresada e intenta nuevamente.',
                life: 3000,
            });
            Object.values(this.descuentoForm.controls).forEach((control) => {
                control.markAllAsTouched();
                control.markAsDirty();
            });
            return;
        }

        // Encontrar el índice del descuento en la lista
        const index = this.descuentos.findIndex(
            (desc: any) =>
                desc.desnombre === this.item.desnombre &&
                desc.desdescripcion === this.item.desdescripcion
        );

        // Verificar si el descuento existe en la lista
        if (index !== -1) {
            // Actualizar el descuento en la lista
            this.descuentos[index] = {
                ...this.descuentos[index], // Mantener los valores existentes
                desnombre: this.descuentoForm.value.desnombre,
                desdescripcion: this.descuentoForm.value.desdescripcion,
                desmonto: this.descuentoForm.value.desmonto,
            };

            this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Descuento actualizado correctamente.',
                life: 3000,
            });

            // Limpiar el formulario y cerrar el diálogo
            this.descuentoForm.reset();
            this.descuentoDialog = false;

            // Recalcular los descuentos y el resumen financiero
            this.calcularDescuento();

        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Descuento No Encontrado',
                detail: 'El descuento seleccionado no se encontró en la lista.',
                life: 3000,
            });
        }
    }

    deleteDescuento(item: any) {
        // Encontrar el índice del elemento en la lista descuentos
        const index = this.descuentos.findIndex(
            (desc: any) =>
                desc.desnombre === item.desnombre &&
                desc.desdescripcion === item.desdescripcion &&
                desc.desmonto === item.desmonto
        );

        // Verificar si el elemento existe en la lista
        if (index !== -1) {
            // Eliminar el elemento de la lista
            this.descuentos.splice(index, 1);

            // Actualizar la vista
            this.cdr.detectChanges();
            this.dt.reset();

            // Recalculatr los descuentos y el resumen financiero
            this.calcularDescuento();

            this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Descuento eliminado correctamente.',
                life: 3000,
            });


        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Elemento No Encontrado',
                detail: 'El descuento seleccionado no se encontró en la lista.',
                life: 3000,
            });
        }
    }

    generateReport(){
        this.contabilidadService.rptCursoMateriaContabilidad(this.dateForm.value.startDate, this.dateForm.value.endDate, this.descuentos, this.resumenFinanciero)
    }

}
