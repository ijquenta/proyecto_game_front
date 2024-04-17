import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
// Services
import { UsuarioService } from 'src/app/modules/service/data/usuario.service';
import { ReporteService } from 'src/app/modules/service/data/reporte.service';
// Models
import { Usuarios } from 'src/app/modules/models/usuarios';
import { Usuario,  } from 'src/app/modules/models/usuario';
import { TipoPersona, TipoPersona2, TipoRol } from 'src/app/modules/models/diccionario';
import { AuthService } from 'src/app/services/auth.service';
// For validations
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { API_URL_FOTO_PERFIL } from 'src/environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import * as FileSaver from 'file-saver';
interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}

interface ExportColumn {
    title: string;
    dataKey: string;
}
@Component({
    templateUrl: './usuario-crud.component.html',
    providers: [MessageService],
    styleUrls: ['./usuario-crud.component.css']
})
export class UsuarioCrudComponent implements OnInit {

    // --------- Tipo Persona ---------
    tipoPersona: TipoPersona2[] = [];
    tipoPersonaSeleccionada:  TipoPersona2;
    loading: boolean = false;
    usuarios: Usuario[] = [];
    usuariosInactivos: Usuario[] = [];
    usuariosDuplicated: Usuario[] = [];
    usuario: Usuario;
    datosUsuario: Usuario;
    usuarioRegistro: Usuario;
    usuarioDialog: boolean = false;
    optionDialog: boolean = false;
    // --------- Tipo Rol ---------
    tipoRol: TipoRol[] = [];
    tipoRolSeleccionada: TipoRol;
    // --------- Variables any ---------
    errors: any;
    desactivarUsuarioDialog: boolean = false;
    activarUsuarioDialog: boolean = false;
    usuarioCambiarPasswordDialog: boolean = false;
    rowsPerPageOptions = [5, 10, 20];
    // --------- Variables for Dataview ---------
    sortOrder: number = 0;
    sortField: string = '';
    filteredUsuarios: any[] = [];
    searchText: string = '';
    items: MenuItem[];
    // --------- Variables para validaciones ---------
    usuarioForm: FormGroup;
    usuarioPwdForm: FormGroup;
    apiUrl = API_URL_FOTO_PERFIL;
    originalUsername: any;
    colsTable!: Column[];
    exportColumns!: ExportColumn[];
    constructor(
                private messageService: MessageService,
                private usuarioService: UsuarioService,
                private authService: AuthService,
                public reporte: ReporteService,
                private formBuilder: FormBuilder,
                private spinner: NgxSpinnerService
                )
                {}
    ngOnInit() {
        this.loading = true;
        this.obtenerDatosUsuario();
        this.listarUsuarios();
        this.listarPersonaCombo();
        // this.listarRolCombo();
        this.usuarioForm = this.formBuilder.group({
            uf_id: [''],
            uf_usuname: [
                '',
                [Validators.required,
                 Validators.minLength(5),
                 Validators.maxLength(20),
                 this.noEspacios,
                 this.inicioCorrecto
                ],
                [this.validarNombreUsuarioExistente()] // Asynchronous validators
            ],
            uf_tipPerSel: ['', Validators.required],
            uf_tipRolSel: ['', Validators.required],
            uf_email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
            uf_descripcion: ['']
        });

        this.usuarioPwdForm = this.formBuilder.group({
            usupassword: ['', [Validators.required, Validators.minLength(8), this.passwordStrength]],
            usupassword2: ['', [Validators.required]]
        }, { validator: this.passwordMatchValidator });


        this.colsTable = [
            { field: 'usuid', header: 'ID usuario' },
            { field: 'usuname', header: 'Nombre de usuario' },
            { field: 'pernomcompleto', header: 'Nombre completo' },
            { field: 'pernrodoc', header: 'Número de documento' },
            { field: 'usuemail', header: 'Email de usuario' },
            { field: 'rolnombre', header: 'Rol de usuario' },
            { field: 'usuestado', header: 'Estado del usuario' },
            { field: 'usudescripcion', header: 'Descripcion' },
            { field: 'usuusureg', header: 'Usuario Registro' },
            { field: 'usufecreg', header: 'Fecha Registro' },
            { field: 'usuusumod', header: 'Usuario Modificación' },
            { field: 'usufecmod', header: 'Fecha Modificación' }
        ];

        this.exportColumns = this.colsTable.map((col) => ({ title: col.header, dataKey: col.field }));

    }
    passwordStrength(control: AbstractControl): { [key: string]: boolean } | null {
      const value = control.value;
      if (value && (!value.match(/[A-Z]/) || !value.match(/[a-z]/) || !value.match(/[0-9]/))) {
        return { passwordStrength: true };
      }
      return null;
    }

    passwordMatchValidator(fg: FormGroup): { [key: string]: boolean } | null {
        const password = fg.get('usupassword').value;
        const confirmPassword = fg.get('usupassword2').value;
        if (password && confirmPassword && password !== confirmPassword) {
            return { mismatch: true };
        }
        return null;
    }

    noEspacios(control: AbstractControl) {
        const valor = control.value;
        if (valor?.includes(' ')) {
          return { espaciosNoPermitidos: true };
        }
        return null;
    }

    inicioCorrecto(control: AbstractControl) {
        const valor = control.value;
        if (valor && !valor.match(/^[a-zA-Z]/)) {
          return { inicioInvalido: true };
        }
        return null;
    }

    validarNombreUsuarioExistente(): AsyncValidatorFn { // Método para crear un validador asíncrono para verificar si un nombre de usuario ya existe
        return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {         // Se retorna una función que actúa como validador asíncrono
            const nombreUsuario = control.value; // Se obtiene el valor del control de formulario, que representa el número de documento ingresado por el usuario
            if (!nombreUsuario) { // Si el número de documento está vacío, no se realiza ninguna validación
                return of(null); // Se devuelve un observable que emite null
            }
            const existe = this.usuariosDuplicated.some(usuario => usuario.usuname === nombreUsuario);// Se verifica si algún elemento en la lista de personas tiene el mismo nombre de usuario
            return of(existe ? { nombreUsuarioExiste: true } : null); // Se devuelve un observable que emite un objeto de errores si existe un duplicado, de lo contrario, emite null
        }
    }

    obtenerDatosUsuario() {
        this.authService.usuario$.subscribe((user => {
            if (user) {
                if (Array.isArray(user) && user.length > 0) {
                    this.datosUsuario = user[0];

                    this.listarRolCombo();
                }
            }
        }));
    }


    listarRolCombo() {
        this.usuarioService.getRoles().subscribe(
            (result: any) => {
                this.tipoRol = result;
                console.log("datos usuario: ", this.datosUsuario)
                if(this.datosUsuario?.rolid == 2){
                    this.tipoRol = this.tipoRol.filter(usuario => usuario.rolid !== 1);
                    console.log("echo")
                }
                console.log("tiporol normal: ", this.tipoRol)
            },
            (error) => {
                console.error('Error al obtener los roles:', error);
            }
        );
    }



    listarPersonaCombo(){
        this.usuarioService.getTipoPersona().subscribe(
            (result: any) => {
                this.tipoPersona = result;
            }
        )
    }

    filterUsuarios(){
        this.filteredUsuarios = this.usuarios.filter(usuario => usuario.pernomcompleto.toLowerCase().includes(this.searchText.toLowerCase()));
    }

    listarUsuarios(){
        this.spinner.show();
        this.loading = true;
        this.usuarioService.listaUsuario().subscribe(
            (result: any) => {
                this.usuarios = result;
                console.log("usuarios: ", this.usuarios)
                this.usuariosDuplicated = this.usuarios;
                this.usuariosInactivos = this.usuarios.filter(usuario => usuario.usuestado === 0);
                this.usuarios = this.usuarios.filter(usuario => usuario.usuestado === 1);
                this.filteredUsuarios = this.usuarios;
                this.loading = false;
                this.spinner.hide();
            },
            (error: any) => {
                this.messageService.add({ severity: 'error', summary: 'Problema', detail: 'Ocurrío un error en el recuperar información del sistema.', life: 3000 });
                this.loading = false;
                this.spinner.hide();
            }
        )
    }

    nuevaPersona() {
        this.usuario = new Usuario();
        this.usuarioRegistro = new Usuario();
        this.tipoPersonaSeleccionada = null;
        this.tipoRolSeleccionada = null;
        this.usuarioDialog = true;
        this.optionDialog = true;
        this.usuarioForm.reset();
    }

    editarUsuario(data: Usuario){
        this.usuario = { ...data };
        this.usuarioDialog = true;
        this.optionDialog = false;

        // Al cargar los datos para la edición, también guarda el nombre de usuario original
        this.originalUsername = this.usuario.usuname;

        this.usuarioForm.patchValue({
            uf_id: this.usuario.usuid,
            uf_usuname: this.usuario.usuname,
            uf_tipPerSel: new TipoPersona2(this.usuario.perid, this.usuario.pernomcompleto, this.usuario.pernrodoc, this.usuario.perfoto),
            uf_tipRolSel: new TipoRol(this.usuario.rolid, this.usuario.rolnombre),
            uf_email: this.usuario.usuemail,
            uf_descripcion: this.usuario.usudescripcion
        });

        // Ajustar el validador asincrónico para el nombre de usuario solo si es necesario
        const usunameControl = this.usuarioForm.get('uf_usuname');
        usunameControl.clearAsyncValidators();
        if (this.originalUsername) {
            usunameControl.setAsyncValidators([this.validateUsernameIfChanged.bind(this)]);
        }
        usunameControl.updateValueAndValidity(); // Asegúrate de actualizar la validez del control
    }

    validateUsernameIfChanged(control: AbstractControl) {
        // La validación se ignora si el valor no ha cambiado
        if (control.value === this.originalUsername) {
            return of(null);
        } else {
            return this.validarNombreUsuarioExistente()(control);
        }
    }


    confirmarDesactivar(data: Usuario){
        this.desactivarUsuarioDialog = true;
        this.usuario = { ...data };
    }

    confirmarActivar(data: any) {
        this.usuario = { ...data };
        console.log(this.usuario);
        this.activarUsuarioDialog = true;
    }

    confirmarCambiarPassword(data: Usuario){
        this.usuarioCambiarPasswordDialog = true;
        this.usuario = { ...data };
    }

    cambiarPasswordUsuario(){
        if(this.usuarioPwdForm.invalid){
            this.messageService.add({ severity: 'error', summary: 'Error en el Registro', detail: 'Por favor, verifica la información ingresada e intenta nuevamente.', life: 3000 });
            return Object.values(this.usuarioPwdForm.controls).forEach(control=>{
                control.markAllAsTouched();
                control.markAsDirty();
            })
        }
        this.usuarioRegistro = new Usuario();
        this.usuarioRegistro = { ...this.usuario};
        this.usuarioRegistro.usupassword = this.usuarioPwdForm.value.usupassword;
        console.log("Cambiar password: ",this.usuarioRegistro);
        this.usuarioService.gestionarUsuarioPassword(this.usuarioRegistro).subscribe(
            (result: any) => {
                this.messageService.add({ severity: 'success', summary: 'Proceso realizado correctamente', detail: 'Usuario Activado.', life: 3000});
                this.usuarioCambiarPasswordDialog = false;
                this.usuarioPwdForm.reset();
                this.listarUsuarios();
            },
            (error) => {
                this.errors = error;
                this.messageService.add({ severity: 'error', summary: 'Error de proceso', detail: 'Se produjo un error al intentar activar el usuario.', life: 3000});
            }
        )

    }
    desactivarUsuario() {
        this.usuarioRegistro = new Usuario();
        this.usuarioRegistro = { ...this.usuario};
        this.usuarioRegistro.tipo = 2;
        this.usuarioRegistro.usuusumod = this.datosUsuario.usuname;
        console.log(this.usuarioRegistro);
        this.usuarioService.gestionarUsuarioEstado(this.usuarioRegistro).subscribe(
            (result: any) => {
                this.messageService.add({ severity: 'success', summary: 'Proceso realizado correctamente', detail: 'Usuario Desactivado.', life: 3000});
                this.desactivarUsuarioDialog = false;
                this.listarUsuarios();
            },
            (error) => {
                this.errors = error;
                this.messageService.add({ severity: 'error', summary: 'Error de proceso', detail: 'Se produjo un error al intentar desactivar el usuario.', life: 3000});
            }
        )
    }

    activarUsuario() {
        this.usuarioRegistro = new Usuario();
        this.usuarioRegistro = { ...this.usuario};
        this.usuarioRegistro.tipo = 3;
        this.usuarioRegistro.usuusumod = this.datosUsuario.usuname;
        console.log(this.usuarioRegistro);
        this.usuarioService.gestionarUsuarioEstado(this.usuarioRegistro).subscribe(
            (result: any) => {
                this.messageService.add({ severity: 'success', summary: 'Proceso realizado correctamente', detail: 'Usuario Activado.', life: 3000});
                this.activarUsuarioDialog = false;
                this.listarUsuarios();
            },
            (error) => {
                this.errors = error;
                this.messageService.add({ severity: 'error', summary: 'Error de proceso', detail: 'Se produjo un error al intentar activar el usuario.', life: 3000});
            }
        )
    }

    ocultarDialog(){
        this.usuarioDialog = false;
        this.usuarioCambiarPasswordDialog = false;
        this.usuarioPwdForm.reset();
    }

    enviarFormulario(){
        if (this.optionDialog) {
            if(this.usuarioForm.invalid){
                this.messageService.add({ severity: 'error', summary: 'Error en el Registro', detail: 'Por favor, verifica la información ingresada e intenta nuevamente.', life: 3000 });
                return Object.values(this.usuarioForm.controls).forEach(control=>{
                    control.markAllAsTouched();
                    control.markAsDirty();
                })
            }
            this.usuarioRegistro = new Usuario();
            this.usuarioRegistro.tipo = 1;
            this.usuarioRegistro.usuid = null;
            this.usuarioRegistro.perid = this.usuarioForm.value.uf_tipPerSel.perid;
            this.usuarioRegistro.rolid = this.usuarioForm.value.uf_tipRolSel.rolid;
            this.usuarioRegistro.usuname = this.usuarioForm.value.uf_usuname;
            this.usuarioRegistro.usuemail = this.usuarioForm.value.uf_email;
            this.usuarioRegistro.usuimagen = null;
            this.usuarioRegistro.usuestado = 1;
            this.usuarioRegistro.usuusureg = this.datosUsuario.usuname;
            this.usuarioRegistro.usudescripcion = this.usuarioForm.value.uf_descripcion;
            this.usuarioService.gestionarUsuario(this.usuarioRegistro).subscribe(
                (result: any) => {
                    this.messageService.add({ severity: 'success', summary: 'Exitosamente', detail: 'Proceso realizado correctamente.', life: 5000});
                    this.optionDialog = false;
                    this.usuarioDialog = false;
                    this.listarUsuarios();
                },
                (error) => {
                    console.log("error: ", error);
                    let errorMessage = 'Se produjo un error al intentar registrar el usuario.';

                    // Verifica si el error contiene el mensaje específico de violación de clave única
                    if (error.error.message.includes('UniqueViolation')) {
                        errorMessage = 'No se puede crear el usuario porque ya existe un registro con el mismo rol para esta persona.';
                    }

                    this.messageService.add({ severity: 'error', summary: 'Error en el Registro', detail: errorMessage, life: 7000});
                }
            );
        }
        else{
            if(this.usuarioForm.invalid){
                this.messageService.add({ severity: 'error', summary: 'Error en el Registro', detail: 'Por favor, verifica la información ingresada e intenta nuevamente.', life: 3000 });
                return Object.values(this.usuarioForm.controls).forEach(control=>{
                    control.markAllAsTouched();
                    control.markAsDirty();
                })
            }
            this.usuarioRegistro = new Usuario();
            this.usuarioRegistro.tipo = 2;
            this.usuarioRegistro.usuid = this.usuarioForm.value.uf_id;
            this.usuarioRegistro.usuname = this.usuarioForm.value.uf_usuname;
            this.usuarioRegistro.usuemail = this.usuarioForm.value.uf_email;
            this.usuarioRegistro.perid = this.usuarioForm.value.uf_tipPerSel.perid;
            this.usuarioRegistro.rolid = this.usuarioForm.value.uf_tipRolSel.rolid;
            this.usuarioRegistro.usuimagen = null;
            this.usuarioRegistro.usuestado = 1;
            this.usuarioRegistro.usuusureg = this.datosUsuario.usuname;
            this.usuarioRegistro.usudescripcion = this.usuarioForm.value.uf_descripcion;
            this.usuarioService.gestionarUsuario(this.usuarioRegistro).subscribe(
                (result: any) => {
                    this.messageService.add({ severity: 'success', summary: 'Exitosamente', detail: 'Proceso de modificado realizado correctamente.', life: 3000});
                    this.optionDialog = false;
                    this.usuarioDialog = false;
                    this.listarUsuarios();
                },
                (error) => {
                    console.log("error: ", error);
                    let errorMessage = 'Se produjo un error al intentar modificar el usuario.';

                    // Verifica si el error contiene el mensaje específico de violación de clave única
                    if (error.error.message.includes('UniqueViolation')) {
                        errorMessage = 'No se puede modificar el usuario porque ya existe un registro con el mismo rol para esta persona.';
                    }

                    this.messageService.add({ severity: 'error', summary: 'Error en el Registro', detail: errorMessage, life: 7000});
                }
            )
        }
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }

    obtenerSeverityEstado(estado: number): string {
        switch (estado) {
            case 1:
                return 'success';
            case 0:
                return 'danger';
            default:
                return 'info';
        }
    }

    obtenerDescripcionEstado(estado: number): string {
        switch (estado) {
            case 1:
                return 'Activo';
            case 0:
                return 'Inactivo';
            default:
                return 'Ninguno';
        }
    }

    exportPdf() {
        import('jspdf').then(jsPDF => {
            import('jspdf-autotable').then(() => {
                // Cambia 'p' por 'l' para la orientación horizontal
                // Considera ajustar las unidades a 'pt' para mejor manejo del tamaño
                const doc = new jsPDF.default('l', 'pt', 'a4');
                // Agregar un título
                doc.setFontSize(16); // Tamaño de la fuente
                doc.text('Lista de Usuarios', 14, 30); // Agrega texto en la posición x = 14, y = 30
                // Configura las columnas y el cuerpo del PDF
                (doc as any).autoTable({
                    columns: this.exportColumns,
                    body: this.usuariosDuplicated,
                    theme: 'striped',  // Puedes elegir otros temas como 'plain', 'striped' o 'grid'
                    styles: { fontSize: 8, cellPadding: 3 },  // Ajusta el tamaño de fuente y el padding para acomodar más datos
                });
                // Guarda el archivo PDF
                doc.save('lista_usuarios.pdf');
            });
        });
    }

    exportExcel() {
        import('xlsx').then((xlsx) => {
            // Define los campos que deseas incluir en la exportación
            const fieldsToExport = [
                'usuid',
                'usuname',
                'pernomcompleto',
                'pernrodoc',
                'usuemail',
                'rolnombre',
                'usuestado',
                'usudescripcion',
                'usuusureg',
                'usufecreg',
                'usuusumod',
                'usufecmod',
            ];
            // Filtra y transforma 'this.personas' para incluir solo los campos deseados
            const dataToExport = this.usuariosDuplicated.map(persona => {
                const filteredData = {};
                fieldsToExport.forEach(field => {
                    filteredData[field] = persona[field] || ''; // Asegura que todos los campos existan, incluso si están vacíos
                });
                return filteredData;
            });
            const worksheet = xlsx.utils.json_to_sheet(dataToExport);
            const workbook = { Sheets: { 'Data': worksheet }, SheetNames: ['Data'] };
            const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
            this.saveAsExcelFile(excelBuffer, 'persons');
        });
    }

    saveAsExcelFile(buffer: any, fileName: string): void {
        let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        let EXCEL_EXTENSION = '.xlsx';
        const data: Blob = new Blob([buffer], {
            type: EXCEL_TYPE
        });
        FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    }
}
