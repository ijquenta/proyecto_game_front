// --------- Importación principal
import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { MenuItem, MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner'; // spinner
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // validaciones
import logoIbciBase64 from '../../../../../assets/base64/logo_ibci_base64.js';
// import { UploadEvent} from 'src/app/modules/models/upload.js';
import { environment } from 'src/environments/environment';
import { switchMap } from 'rxjs/operators';
import { FileUpload } from 'primeng/fileupload';
import { Injectable } from '@angular/core';
// --------- Importación servicios
import { AuthService } from 'src/app/modules/service/core/auth.service';
import { MatriculaService } from 'src/app/modules/service/data/matricula.service';
import { PagoService } from 'src/app/modules/service/data/pago.service';
import { UploadService } from 'src/app/modules/service/data/upload.service';
// --------- Importación modelos
import { Matricula, TiposMatricula, TipoPersonaEstudiante } from 'src/app/modules/models/matricula';
import { Usuario } from 'src/app/modules/models/usuario';
import { ExportColumn, Column } from 'src/app/modules/models/exportFile';
import { Pago, TipoPago } from 'src/app/modules/models/pago';

interface UploadEvent {
    originalEvent: Event;
    files: File[];
}

@Injectable({
    providedIn: 'root',
})

@Component({
    templateUrl: './matricula-nuevo.component.html',
    providers: [MessageService],
    styleUrls: ['../../../../app.component.css']
})



export class MatriculaNuevoComponent implements OnInit {
        @ViewChild('fileUpload') fileUpload: FileUpload;
        // Variables Matricula
        listaMatricula: Matricula[] = [];
        listaMatriculaInactivo: Matricula[] = [];
        listaMatriculaDuplicado: Matricula[] = [];
        matriculaDialog: boolean = false;
        opcionMatricula: boolean = false;
        activarMatriculaDialog: boolean = false;
        desactivarMatriculaDialog: boolean = false;
        matricula = new Matricula();
        loading: boolean = false;
        userProfilePhoto = environment.API_URL_PROFILE_PHOTO;
        tiposMatricula: TiposMatricula[] = [];
        tipoPersonaEstudiante: TipoPersonaEstudiante[] = [];
        pagoMatriculaDialog: boolean = false;

        // Variables ValidacionMatricula
        matriculaForm: FormGroup;
        pagoForm: FormGroup;
        // Usuario
        usuario: Usuario;
        // Variables para exportar PDF
        colsTable!: Column[];
        exportColumns!: ExportColumn[];
        // --------- Variables for Dataview ---------
        sortOrder: number = 0;
        sortField: string = '';
        filteredUsuarios: any[] = [];
        searchText: string = '';
        items: MenuItem[];
        // Variable pago
        tipoPago: TipoPago[] = [];
        pago = new Pago();
        pagidlast: any;
        // Variable para archivos
        archivos: any = {};
        uploadedFiles: any[] = [];
        nombreArchivo: any;
        loadingSpinner: boolean = false;

      //-----------------Variables-------------------//s

    constructor(
                private messageService: MessageService,
                private matriculaService: MatriculaService,
                private spinner: NgxSpinnerService,
                private authService: AuthService,
                private formBuilder: FormBuilder,
                private pagoService: PagoService,
                private uploadService: UploadService,
                ) { }

    ngOnInit() {


        this.listarMatricula();

        this.getProfileUsuario(); // obtener los valores del usuario logueado

        this.asignacionValidacion(); // se asigna los parametros para la variable de validación

        this.asignacionValidacionesPago(); // se asigna los pararmetros para la variable pago de validación

        this.obtenerColumnas(); // obtener Columnas para exportar en excel y pdf la listaTipoMatricula

        this.obtenerTiposMatricula();

        this.obtenerTipoPago();

        this.obtenerTipoPersonaEstudiante();

    }

    // Obtener tipos de matricula
    obtenerTiposMatricula(){
        this.matriculaService.listarTipoMatriculaCombo().subscribe(
            (result: any)=>{
                this.tiposMatricula = result;
            },
            (error: any)=>{
                console.error(error);
            }
        )
    }

    // Obtener personas de tipo estudiante
    obtenerTipoPersonaEstudiante(){
        this.matriculaService.listarTipoPersonaEstudiante().subscribe(
            (result: any)=>{
                this.tipoPersonaEstudiante = result;
            },
            (error: any)=>{
                console.error(error);
            }
        )
    }

    // Obtener los tipos de pagos
    obtenerTipoPago() {
        this.pagoService.getTipoPago().subscribe(
            (result: any) => {
                this.tipoPago = result;
            }
        )
    }

    // Función para listar las asignaciones de matricula
    listarMatricula(){
        this.spinner.show();
        this.matriculaService.listarMatricula().subscribe(
            (result: any) => {
                this.listaMatricula = result;
                this.listaMatriculaDuplicado = this.listaMatricula;
                this.listaMatriculaInactivo = this.listaMatricula.filter(matricula => matricula.matrestado === 0);
                this.listaMatricula = this.listaMatricula.filter(matricula => matricula.matrestado === 1);
                this.spinner.hide();
            },
            (error: any) => {
                console.error(error);
                this.spinner.hide();
            }
        )
    }

    // Obtener columnas para recuperar los datos para exportar en pdf.
    obtenerColumnas() {
        this.colsTable = [
            { field: 'matrid', header: 'Cod. Matr.' },
            { field: 'matrfec', header: 'Fecha' },
            { field: 'tipmatrgestion', header: 'Matricula' },
            { field: 'tipmatrcosto', header: 'Costo' },
            { field: 'pernomcompleto', header: 'Estudiante' },
            { field: 'pagdescripcion', header: 'Pago' },
            { field: 'pagmonto', header: 'Monto' },
            { field: 'matrdescripcion', header: 'Descripción' },
            { field: 'matrestado', header: 'Estado' }
        ];

        this.exportColumns = this.colsTable.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    // Función para nueva asignación de matricula a un usuario
    nuevaAsignacion() {
        this.matriculaForm.reset();
        this.matriculaDialog = true;
        this.opcionMatricula = true;
        this.matriculaForm.patchValue({
            matrfec: new Date()
        })
    }

    // Funcion para asignar variables de validación para el formulario de registro
    asignacionValidacion() {
        this.matriculaForm = this.formBuilder.group({
            matrid: [''],
            tiposMatricula: ['', [Validators.required]],
            matrfec: ['', [Validators.required]],
            tipoPersona: ['', [Validators.required]],
            matrdescripcion: ['', [Validators.required]]
        });
    }

    // Método para asignar las variables de React Form Valid
    asignacionValidacionesPago() {
        this.pagoForm = this.formBuilder.group({
            pagoid: [''],
            matrid:[''],
            pagdescripcion:['', [Validators.required]],
            pagofecha: ['', [Validators.required]],
            pagmonto: ['', [Validators.required, Validators.min(0)]],
            tipoPago: ['', [Validators.required]],
        });
    }

    // Función de cancelar formulario
    ocultarDialog() {
        this.matriculaDialog = false;
        this.pagoMatriculaDialog = false;
        this.opcionMatricula = true;
        this.messageService.add({ severity: 'info', summary: 'Cancelar', detail: 'Operación cancelada', life: 3000 });
        this.matriculaForm.reset();
    }

    // Función para editar matricula
    editarMatricula(data: any) {
        this.obtenerTiposMatricula();
        this.obtenerTipoPersonaEstudiante();
        this.matriculaForm.reset();
        this.matricula = { ...data };
        this.matriculaDialog = true;
        this.opcionMatricula = false;
        this.setData();
    }

    // Función para obtener datos para setear datos en el formulario
    setData(){
        this.matriculaForm.patchValue({
            matrid: this.matricula.matrid,
            tiposMatricula: new TiposMatricula(this.matricula.tipmatrid, this.matricula.tipmatrgestion),
            tipoPersona: new TipoPersonaEstudiante(this.matricula.peridestudiante, this.matricula.pernomcompleto, this.matricula.perfoto),
            matrfec: this.matricula.matrfec,
            matrdescripcion: this.matricula.matrdescripcion
        })
    }

    // Función para obtener datos del formulario para registrar
    obtenerBody(){
        this.matricula.tipmatrid = this.matriculaForm.value.tiposMatricula.tipmatrid;
        this.matricula.peridestudiante = this.matriculaForm.value.tipoPersona.perid;
        this.matricula.matrdescripcion = this.matriculaForm.value.matrdescripcion;
        this.matricula.matrusureg = this.usuario.usuname;
        this.matricula.matrusumod = this.usuario.usuname;
        const body = {...this.matricula}
        return body;
    }

    // Función para guardar los datos para agregar y modificar
    guardarMatricula() {
        if(this.matriculaForm.invalid){
            this.messageService.add({ severity: 'error', summary: 'Ups! error de registro', detail: 'Por favor, verifica la información ingresada e intenta nuevamente.', life: 5000 });
            return Object.values(this.matriculaForm.controls).forEach(control=>{
                control.markAllAsTouched();
                control.markAsDirty();
            })
        }
        if(this.matriculaForm.valid){

            // window.alert("Hola mira mis datos: " + JSON.stringify(this.matriculaForm.value));

            this.obtenerBody();

            if(this.opcionMatricula){
                this.matricula.matrfec = this.matriculaForm.value.matrfec;
                this.matriculaService.insertarMatricula(this.matricula).subscribe(
                    (result: any) => {
                        console.log("result", result);
                        this.messageService.add({ severity: 'success', summary: 'Registro correcto', detail: 'Matricula agregada correctamente en el sistema', life: 5000 });
                        this.listarMatricula();
                        this.matriculaDialog = false;
                        this.opcionMatricula = false;
                        this.matriculaForm.reset();
                    },
                    error => {
                            console.log("error: ", error);
                            let errorMessage = 'Se produjo un error.';

                            if (error.error.message.includes('UniqueViolation')) {
                                errorMessage = 'No se puede crear el registro.';
                            }

                            this.messageService.add({ severity: 'error', summary: 'El registro ya exite.', detail: errorMessage, life: 7000});
                        }
                );
            } else{
                const parts = this.matricula.matrfec.split('/');
                const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
                this.matricula.matrfec = formattedDate;

                this.matriculaService.modificarMatricula(this.matricula).subscribe(
                    (result: any) => {
                        this.messageService.add({ severity: 'success', summary: 'Registro correcto', detail: 'Matricula modificado correctamente en el sistema', life: 5000 });
                        this.listarMatricula();
                        this.matriculaDialog = false;
                        this.opcionMatricula = false;
                        this.matriculaForm.reset();
                    },
                    (error: any) => {
                    console.log("error",error);
                        this.messageService.add({severity:'warn', summary:'Error', detail:'Algo salio mal, al modificar la matricula'});
                    }
                );
            }
        }

    }

    // Función para exportar el documento PDF
    exportPdf() {
        import('jspdf').then(jsPDF => {
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF.default('l', 'pt', 'a4');

                // Título centrado
                const title = 'Lista de asignación de matricula por estudiante';
                const titleFontSize = 16;
                const titleWidth = doc.getStringUnitWidth(title) * titleFontSize / doc.internal.scaleFactor;
                const titleX = (doc.internal.pageSize.getWidth() - titleWidth) / 2;
                const titleY = 60;
                doc.setFontSize(titleFontSize);
                doc.text(title, titleX, titleY);

                // Subtítulo
                const subtitle = 'Esta lista representa las matriculas asignados por estudiante';
                const subtitleFontSize = 9;
                const subtitleX = 20;
                const subtitleY = 80;
                doc.setFontSize(subtitleFontSize);
                doc.text(subtitle, subtitleX, subtitleY);

                // Descripción
                const description = 'Sistema de Seguimiento y Gestión Académico';
                const descriptionFontSize = 10;
                const descriptionX = 100;
                const descriptionY = 40;
                doc.setFontSize(descriptionFontSize);
                doc.text(description, descriptionX, descriptionY);

                const description2 = 'Instituto Biblico de Capacitación Internacional';
                const descriptionFontSize2 = 10;
                const descriptionX2 = 100;
                const descriptionY2 = 30;
                doc.setFontSize(descriptionFontSize2);
                doc.text(description2, descriptionX2, descriptionY2);

                // Imagen en base64
                const base64Image = logoIbciBase64;
                const imageX = 20;
                const imageY = 10;
                const imageWidth = 80; // Ancho de la imagen en puntos
                const imageHeight = 50; // Alto de la imagen en puntos
                doc.addImage(base64Image, 'PNG', imageX, imageY, imageWidth, imageHeight);

                // Tabla de datos
                (doc as any).autoTable({
                    columns: this.exportColumns,
                    body: this.listaMatriculaDuplicado,
                    theme: 'striped',
                    styles: { fontSize: 8, cellPadding: 3 },
                    startY: 100, // Posición inicial de la tabla
                });

                doc.save('lista_asignacion_matricula.pdf');
            });
        });
    }

    // Funcion para obtener datos del usuario logueado
    getProfileUsuario() {
        this.authService.getProfile().subscribe(usuario => {
            this.usuario = usuario[0];
        });
    }

    // Funciones para gestionar el estado de los registos
    desactivarMatricula(data: Matricula) {
        this.desactivarMatriculaDialog = true;
        this.matricula = { ...data };
        this.matricula.tipo = 2;
    }
    activarMatricula(data: Matricula) {
        this.activarMatriculaDialog = true;
        this.matricula = { ...data };
        this.matricula.tipo = 3;
    }
    confirmarActivarDesactivar() {
        this.matricula.matrusumod = this.usuario.usuname;
        this.matriculaService.gestionarMatriculaEstado(this.matricula).subscribe(
            (result: any) => {
                this.messageService.add({ severity: 'success', summary: 'Registro correcto', detail: 'Estado del tipo matricula modificada correctamente en el sistema', life: 5000 });
                this.listarMatricula();
                this.activarMatriculaDialog = false;
                this.desactivarMatriculaDialog = false;
                this.matricula = new Matricula();
            },
            error => {
            console.log("error",error);
                this.messageService.add({severity:'warn', summary:'Error', detail: 'Algo salio mal.', life: 5000});
            }
        );
    }

    // Funciones para obtener el color del estado
    getSeverityStatus(estado: number): string {
        switch (estado) {
            case 1:
                return 'success';
            case 0:
                return 'danger';
            default:
                return 'info';
        }
    }

    getDescriptionStatus(estado: number): string {
        switch (estado) {
            case 1:
                return 'Activo';
            case 0:
                return 'Inactivo';
            default:
                return 'Ninguno';
        }
    }

    // Funcion para filtrar la tabla
    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }

    // Funciones para registrar pago
    obtenerPagoBody(){
        this.pago.pagdescripcion = this.pagoForm.value.pagdescripcion;
        this.pago.pagfecha = this.pagoForm.value.pagofecha;
        this.pago.pagmonto = this.pagoForm.value.pagmonto;
        this.pago.pagtipo = this.pagoForm.value.tipoPago.tpagid;
        this.pago.pagusumod = this.usuario.usuname;
        this.pago.pagusureg = this.usuario.usuname;
        this.pago.pagarchivo = this.nombreArchivo;
        const body = { ...this.pago }
        return body;
    }

    pagarMatricula(data: Matricula){
        this.pagoForm.reset();
        this.pagoMatriculaDialog = true;
        this.matricula = {...data};
    }

    // Función para subir archivos
    onUpload(event: UploadEvent) {
        this.archivos = event;
        for(let file of event.files) {
            this.uploadedFiles.push(file);
        }
        this.messageService.add({severity: 'info', summary: 'Archivo', detail: 'Archivo seleccionado correctamente.'});
    }

    // Función para ver el archivo pago subido
    verArchivoPago(pagarchivo: any){
        this.pagoService.getFilePago(pagarchivo);
    }

    registrarPago() {
        if(this.pagoForm.invalid){
            this.messageService.add({ severity: 'error', summary: '¡Oh no! error en el registro', detail: 'Por favor, asegúrate de completar todos los campos obligatorios y luego intenta nuevamente.', life: 5000 });
            return Object.values(this.pagoForm.controls).forEach(control=>{
                control.markAllAsTouched();
                control.markAsDirty();
            })
        }
        if (this.archivos?.currentFiles) {
            this.cargarArchivos(this.archivos.currentFiles, this.matricula);
        }
        this.obtenerPagoBody();
        this.pagoService.insertarPago(this.pago).pipe(
            switchMap((result: any) => {
              this.pagoMatriculaDialog = false;
              this.messageService.add({ severity: 'info', summary: '!Exitosamente¡', detail: 'Pago registrado correctamente.', life: 6000 });
              return this.pagoService.obtenerUltimoPago();
            }),
            switchMap((result: any) => {
              this.pagidlast = result[0].pagid;
              const criterio = {
                matrid: this.matricula.matrid,
                pagid: this.pagidlast,
                matrusumod: this.usuario.usuname
              };
              return this.pagoService.asignarPagoMatricula(criterio);
            })
          ).subscribe(() => {
            this.messageService.add({severity:'info', summary:'¡Éxito!', detail:'Se asignó a la matricula correctamente', life: 7000});
            this.pago = new Pago();
            this.listarMatricula();
          }, error => {
            console.log("error",error);
            this.messageService.add({severity:'warn', summary:'¡Error!', detail:'Ha ocurrido un error'});
          });
    }
    // Función para carga los archivos al servidor backend
    cargarArchivos(currentFiles: File[], matricula: Matricula): void {
        if (currentFiles) {
          const formData = new FormData();
          for (let i = 0; i < currentFiles.length; i++) {
            const file: File = currentFiles[i];
            const nombrePersonaSinEspacios = matricula.pernrodoc.replace(/\s+/g, '');
            const nombreArchivoSinEspacios = file.name.replace(/\s+/g, '');
            const cleanedFilename = nombreArchivoSinEspacios.replace(/[^\w.-]/g, '');
            this.nombreArchivo = nombrePersonaSinEspacios + '_' + cleanedFilename;
            formData.append('files[]', file, this.nombreArchivo);
          }
         this.loadingSpinner = true;
          this.uploadService.uploadFilesPago(formData).subscribe(
            (data: any) => {
              this.fileUpload.clear();
              this.loadingSpinner = false;
              this.messageService.add({ severity: 'success', summary: 'Registro documento!', detail: 'El documento se registró existosamente en el sistema.', life: 7000 });
            },
            (error: any) => {
              this.fileUpload.clear();
              this.loadingSpinner = false;
              console.error('Error en la carga:', error);
            }
          );
        } else {
          console.warn('No se seleccionaron archivos.');
        }
    }

    // Funcion para actualizar el registro de pago, se le envia el data: Pago del cual se setea los datos
    actualizarPago(data: Matricula) {
        this.fileUpload.clear();
        this.pagoForm.reset();
        this.pagoMatriculaDialog = true;
        this.matricula = { ...data };
        // window.alert("mis datos: " + JSON.stringify(this.matricula));
        this.setPagoData();
        this.pago.pagid = this.matricula.pagoidmatricula;
    }

    setPagoData(){
       this.pagoForm.reset(); // Se resetea el pagoForm para que no se retengan ningún datos anteriores.
       this.pagoForm.patchValue({
           pagoid: this.matricula.pagoidmatricula,
           pagdescripcion: this.matricula.pagdescripcion,
           pagofecha: this.matricula.pagfecha,
           pagmonto: this.matricula.pagmonto,
           tipoPago: new TipoPago(this.matricula.pagtipo, this.getText(this.matricula.pagtipo)
         )
       })
    }

    // Funcion para obtener el texto de tipo de pago
    getText(pagtipo: number): string {
        switch (pagtipo) {
          case 1:
            return 'Ninguno';
          case 2:
            return 'Efectivo';
          case 3:
            return 'Deposito Bancario';
          case 4:
            return 'Adelanto';
          case 5:
            return 'Otro';
          default:
            return 'Otro';
        }
    }

    modificarPago() {
        this.obtenerPagoBody();
        // window.alert("mis datos modificarPago: " + JSON.stringify(this.pago));
        if(this.pagoForm.invalid){
            this.messageService.add({ severity: 'error', summary: '¡Oh no! error en el registro', detail: 'Por favor, asegúrate de completar todos los campos obligatorios y luego intenta nuevamente.', life: 5000 });
            return Object.values(this.pagoForm.controls).forEach(control=>{
                control.markAllAsTouched();
                control.markAsDirty();
            })
        }
        if (this.archivos?.currentFiles) {
            this.cargarArchivos(this.archivos.currentFiles, this.matricula);
            this.pago.archivobol = 1;
            this.pago.pagarchivo = this.nombreArchivo;
        }
        else{
            this.pago.archivobol = 0;
            this.pago.pagarchivo = null;
        }
        this.pagoService.modificarPago(this.pago).subscribe(
            (result: any) => {
                this.messageService.add({ severity: 'success', summary: '!Exito¡', detail: 'Pago modificado correctamente.' });
                this.pagoMatriculaDialog = false;
                this.listarMatricula();
            },
            (error: any) => {
                console.error("Error:", error);
                if (error.error && error.error.valor) {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.valor });
                } else {
                    this.messageService.add({ severity: 'warn', summary: 'Error', detail: 'Algo salió mal!' });
                }
            }
        );
    }


}
