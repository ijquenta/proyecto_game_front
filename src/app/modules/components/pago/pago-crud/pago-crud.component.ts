import { Component, OnInit, ViewChild } from '@angular/core';
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AutoComplete } from 'primeng/autocomplete';
import { switchMap } from 'rxjs/operators';
import { Table } from 'primeng/table';
// --------------- Importando el serivico para subir archivos
import { UploadService } from 'src/app/modules/service/data/upload.service';
import { FileUpload } from 'primeng/fileupload';
// --------------- Inportando el servicio de reportes pdf
import { ReporteService } from 'src/app/modules/service/data/reporte.service';
// --------------- Modelo Pago
import { Pago, TipoPago } from 'src/app/modules/models/pago';
// --------------- Importando las APIS del service de Pago
import { PagoService } from 'src/app/modules/service/data/pago.service';
// --------------- Importando las APIS del service de Curso Materia
import { CursoMateria } from 'src/app/modules/models/curso';
// --------------- Modelo Usuario
import { Usuario } from 'src/app/modules/models/usuario';
// --------------- Importación de Autenticación
import { AuthService } from 'src/app/services/auth.service';
// --------------- Importación para validaciones
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';

interface UploadEvent {
    originalEvent: Event;
    files: File[];
}

@Injectable({
    providedIn: 'root',
})

@Component({
  templateUrl: './pago-crud.component.html',
  styleUrls: ['../../../../app.component.css']
})

export class PagoCrudComponent implements OnInit {

  @ViewChild('dtexc') dtexc: Table | undefined;
  @ViewChild('autocomplete') autocomplete:AutoComplete | undefined;
  @ViewChild('fileUpload') fileUpload: FileUpload;
  criterio: any = '';
  loading: boolean = false;
  loading2: boolean = false;
  listarMateriasInscritas: CursoMateria[] = [];
  listarPagoEstudianteMateria: Pago[] = [];
  verPagosEstudianteClicked: boolean = false;
  errors: any;
  verMateriaClicked: boolean = false;
  pago = new Pago();
  pagoAux = new Pago();
  optionPago: boolean = false;
  pagoRegistroDialog: boolean = false;
  curid: any;
  matid: any;
  matnombre: any;
  curnombre: any;
  tipoPago: TipoPago[] = [];
  tipoPagoSeleccionado = new Pago();
  pagidlast: any;
  nombreArchivo: any;
  //----------------Variables para validación----------------//
  pagoForm: FormGroup;
  //----------------Variables para validación----------------//
  usuario: Usuario;
  // Variable para archivos
  archivos: any = {};
  uploadedFiles: any[] = [];
  apiUrl = environment.API_URL_FOTO_PERFIL;
  constructor(
    private messageService: MessageService,
    private reporteService: ReporteService,
    private pagoService: PagoService,
    private authService: AuthService, // auth para recuperar los datos del usuario logueado
    private formBuilder: FormBuilder, // formBuilder para utilzar las validaciones del react form valid
    private uploadService: UploadService,
    private spinner: NgxSpinnerService
    ) {
    }
    ngOnInit(): void {
        this.verMateriaClicked = true; // Variable para ver las materias al hacer click
        this.listarTipoPagoCombo(); // Método para obtener todos los tipo de pago
        this.listarCursosMaterias(); // Método para listar los cursos de las materias
        this.asignacionValidacionesPago(); // Método de asignación de validaciones
        this.getPerfilUsuario(); // Método de getPerfil() de usuario logeado
    }
    // Obtener datos del perfil del usuario logeado
    getPerfilUsuario() {
        this.authService.getPerfil().subscribe(usuario => {
            this.usuario = usuario[0];
        });
    }
    // Método para listar los los cursos
    listarCursosMaterias() {
        this.spinner.show();
        this.loading = true;
        this.pagoService.listarPagoCurso().subscribe(
            (result: any) => {
                this.listarMateriasInscritas = result as CursoMateria[];
                this.loading = false;
                this.spinner.hide();
            },
            (error: any) => {
                this.errors = error;
                console.log("error", error);
                this.messageService.add({severity: 'warn', summary: 'Error', detail: 'Algo salió mal!'});
            }
        );

    }
    convertirAFecha(fechaStr: string): Date {
        // const partesFecha = fechaStr.split('/');
        // const fecha = new Date(Number(partesFecha[2]), Number(partesFecha[1]) - 1, Number(partesFecha[0]));
        const fecha = new Date(fechaStr);
        return fecha;
    }
    // Método para asignar las variables de React Form Valid
    asignacionValidacionesPago() {
        this.pagoForm = this.formBuilder.group({
            pagoid: [''],
            insid:[''],
            pagdescripcion:['', [Validators.required]],
            pagofecha: ['', [Validators.required]],
            pagmonto: ['', [Validators.required, Validators.min(0)]],
            tipoPago: ['', [Validators.required]],
        });
    }
    listarPagoMateria(data: any){
      this.verPagosEstudianteClicked = true;
      this.curid = data.curid; // respaldo curid
      this.curnombre = data.curnombre;
      this.matid = data.matid; // respaldo matid
      this.matnombre = data.matnombre
      const criterio = {
          curid: data.curid,
          matid: data.matid
      }
      this.listarMateriasPorCurso(criterio);
    }
    listarMateriasPorCurso(data: any) {
        this.loading2 = true;
        this.pagoService.listarPagoEstudiantesMateria(data).subscribe((result: any) => {
            this.listarPagoEstudianteMateria = result as Pago[];
            console.log("listarPagoEstudianteMateria", this.listarPagoEstudianteMateria);
            this.loading2 = false;
        //    this.messageService.add({severity:'info', summary:'¡Éxisto!', detail:'Información obtenida con exito'});
        },
        error => {
          this.errors = error;
          console.log("error",error);
          this.messageService.add({severity:'warn', summary:'¡Error!', detail:'Ha ocurrido un error'});
        });
    }

    nuevoPago(data: any) {
      this.pagoForm.reset();
      this.pago = { ...data } // datos
      this.pagoRegistroDialog = true; // activando modal registro
    }

    // Funcion para actualizar el registro de pago, se le envia el data: Pago del cual se setea los datos
    actualizarPago(data: Pago) {
       this.pago = { ...data };
       this.setData();
       this.optionPago = false;
       this.pagoRegistroDialog = true;
    }

    setData(){
      this.pagoForm.reset(); // Se resetea el pagoForm para que no se retengan ningún datos anteriores.
      this.pagoForm.patchValue({
          pagoid: this.pago.pagid,
          insid: this.pago.insid,
          pagdescripcion: this.pago.pagdescripcion,
          pagofecha: this.pago.pagfecha,
          pagmonto: this.pago.pagmonto,
          tipoPago: new TipoPago(this.pago.pagtipo, this.getText(this.pago.pagtipo)
        )
      })
    }

    obtenerBody(){
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

    registrarPago() {
        if(this.pagoForm.invalid){
            this.messageService.add({ severity: 'error', summary: '¡Oh no! error en el registro', detail: 'Por favor, asegúrate de completar todos los campos obligatorios y luego intenta nuevamente.', life: 5000 });
            return Object.values(this.pagoForm.controls).forEach(control=>{
                control.markAllAsTouched();
                control.markAsDirty();
            })
        }
        if (this.archivos?.currentFiles) {
            this.cargarArchivos(this.archivos.currentFiles, this.pago);
        }
        this.obtenerBody();
        this.pagoService.insertarPago(this.pago).pipe(
            switchMap((result: any) => {
              this.pagoRegistroDialog = false;
              this.messageService.add({ severity: 'info', summary: '!Exitosamente¡', detail: 'Pago registrado correctamente.', life: 3000 });
              return this.pagoService.obtenerUltimoPago();
            }),
            switchMap((result: any) => {
              this.pagidlast = result[0].pagid;
              const criterio = {
                pagid: this.pagidlast,
                insid: this.pago.insid,
                pagusumod: this.usuario.usuname
              };
              return this.pagoService.asignarPagoInscripcion(criterio);
            })
          ).subscribe(() => {
            this.messageService.add({severity:'info', summary:'¡Éxito!', detail:'Se asignó a la inscripción correctamente', life: 5000});
            this.pago = new Pago();
            const criterio2 = {
              curid: this.curid,
              matid: this.matid
            };
            this.listarMateriasPorCurso(criterio2);
          }, error => {
            this.errors = error;
            console.log("error",error);
            this.messageService.add({severity:'warn', summary:'¡Error!', detail:'Ha ocurrido un error'});
          });
    }

    registrarPagoService(pago: Pago) {
        this.pagoService.insertarPago(this.pago).subscribe(
            (result: any) => {
                this.pagoRegistroDialog = false;
                this.pago = new Pago();
                const criterio = {
                    curid: this.curid,
                    matid: this.matid
                };
                this.listarMateriasPorCurso(criterio);
                this.messageService.add({ severity: 'info', summary: '!Exitosamente¡', detail: 'Pago registrado correctamente.' });
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

    modificarPago(pago: Pago) {
        this.pago = { ...pago };
        this.obtenerBody();
        if(this.pagoForm.invalid){
            this.messageService.add({ severity: 'error', summary: '¡Oh no! error en el registro', detail: 'Por favor, asegúrate de completar todos los campos obligatorios y luego intenta nuevamente.', life: 5000 });
            return Object.values(this.pagoForm.controls).forEach(control=>{
                control.markAllAsTouched();
                control.markAsDirty();
            })
        }
        if (this.archivos?.currentFiles) {
            this.cargarArchivos(this.archivos.currentFiles, this.pago);
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
                this.pagoRegistroDialog = false;
                const criterio = {
                    curid: this.curid,
                    matid: this.matid
                };
                this.loading2 = true;
                this.pagoService.listarPagoEstudiantesMateria(criterio).subscribe(
                    (result: any) => {
                        this.listarPagoEstudianteMateria = result as Pago[];
                        this.loading2 = false;
                        // this.messageService.add({severity:'info', summary:'Correcto', detail:'Información actualizada'});
                    },
                    (error) => {
                        this.errors = error;
                        console.log("error", error);
                        this.messageService.add({severity:'warn', summary:'Error', detail:'¡Algo salió mal!'});
                    }
                );
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

    cargarArchivos(currentFiles: File[], pago: Pago): void {
        if (currentFiles) {
          const formData = new FormData();
          for (let i = 0; i < currentFiles.length; i++) {
            const file: File = currentFiles[i];
            const nombrePersonaSinEspacios = pago.pernomcompleto.replace(/\s+/g, '');
            const nombreArchivoSinEspacios = file.name.replace(/\s+/g, '');
            const cleanedFilename = nombreArchivoSinEspacios.replace(/[^\w.-]/g, '');
            this.nombreArchivo = nombrePersonaSinEspacios + '_' + cleanedFilename;
            formData.append('files[]', file, this.nombreArchivo);
          }
          this.uploadService.uploadFilesPago(formData).subscribe(
            (data: any) => {
              this.fileUpload.clear();
              this.messageService.add({ severity: 'success', summary: 'Registro de Imagen!', detail: 'La imagen se registró existosamente en el sistema.', life: 5000 });
            },
            (error: any) => {
              this.fileUpload.clear()             ;
              console.error('Error en la carga:', error);
            }
          );
        } else {
          console.warn('No se seleccionaron archivos.');
        }
    }
    verArchivoPago(pagarchivo: any){
        this.pagoService.getFilePago(pagarchivo);
    }
    // Método para obtener los tipos de pagos
    listarTipoPagoCombo() {
        this.pagoService.getTipoPago().subscribe(
            (result: any) => {
                this.tipoPago = result;
            }
        )
    }
    onUpload(event: UploadEvent) {
        this.archivos = event;
        for(let file of event.files) {
            this.uploadedFiles.push(file);
        }
        this.messageService.add({severity: 'info', summary: 'Archivo', detail: 'Archivo seleccionado correctamente.'});
    }
    ocultarDialog(){
        this.pagoRegistroDialog = false;
        this.pagoForm.reset();
    }
    // Método de busqueda en la tabla
    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }
    getSeverityColor(pagtipo: number): string {
        switch (pagtipo) {
          case 1:
            return 'info'; // Color para Ninguno
          case 2:
            return 'success'; // Color para Efectivo
          case 3:
            return 'warning'; // Color para Deposito bancario
          case 4:
            return 'primary'; // Color para Adelanto
          case 5:
            return 'danger'; // Color para Otro
          default:
            return 'info'; // Puedes ajustar este valor por defecto según tus necesidades
        }
      }

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
}
