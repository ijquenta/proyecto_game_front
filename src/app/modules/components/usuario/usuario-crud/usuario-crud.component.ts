import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import * as FileSaver from 'file-saver';

// Servicios
import { UsuarioService } from 'src/app/modules/service/data/usuario.service';
import { ReporteService } from 'src/app/modules/service/data/reporte.service';
import { AuthService } from 'src/app/modules/service/core/auth.service';
import { ArchivosService } from 'src/app/modules/service/util/archivos.service';

// Modelos
import { Usuario,  } from 'src/app/modules/models/usuario';
import { TipoPersona, TipoPersona2, TipoRol } from 'src/app/modules/models/diccionario';
import { Column, ExportColumn } from 'src/app/modules/models/exportFile';
import logoIbciBase64 from '../../../../../assets/base64/logo_ibci_base64.js';

// Para validaciones
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AbstractControl, AsyncValidatorFn } from '@angular/forms';

interface ColumsTable {
    field: string;
    header: string;
}

@Component({
    templateUrl: './usuario-crud.component.html',
    providers: [MessageService],
    styleUrls: ['./usuario-crud.component.css']
})

export class UsuarioCrudComponent implements OnInit {

    // Variables

    // API
    userProfilePhoto = environment.API_URL_PROFILE_PHOTO;

    // Usuario
    usuario: Usuario;
    usuarios: Usuario[] = [];
    usuariosInactivos: Usuario[] = [];
    usuariosDuplicado: Usuario[] = [];
    datosUsuario: Usuario;
    usuarioRegistro: Usuario;
    usuarioDialog: boolean = false;
    deactivateUserDialog: boolean = false;
    activateUserDialog: boolean = false;
    usuarioCambiarPasswordDialog: boolean = false;
    filteredUsuarios: any[] = [];

    // Otras variables
    loading: boolean = false;
    optionDialog: boolean = false;
    errors: any;
    rowsPerPageOptions = [5, 10, 20];

    // Persona
    tipoPersona: TipoPersona2[] = [];

    // Rol
    tipoRol: TipoRol[] = [];

    // Variables para Dataview
    sortOrder: number = 0;
    sortField: string = '';
    searchText: string = '';
    items: MenuItem[];

    // Variables para validación
    usuarioForm: FormGroup;
    usuarioPwdForm: FormGroup;

    originalUsername: any;
    colsTable!: Column[];
    exportColumns!: ExportColumn[];

    home: MenuItem | undefined;
    stateOptionsEstado: any;

    colsColumsTable!: ColumsTable[];

    selectedColumns: { field: string; header: string; }[] = [
        { field: 'tipodocnombre', header: 'Tipo de Documento' },
        { field: 'pernrodoc', header: 'Número de Documento' },
        { field: 'pernomcompleto', header: 'Nombre Completo' },
        { field: 'pernombres', header: 'Nombres' },
        { field: 'perapepat', header: 'Apellido Paterno' },
        { field: 'perapemat', header: 'Apellido Materno' },
        { field: 'perfecnac', header: 'Fecha de Nacimiento' },
        { field: 'generonombre', header: 'Género' },
        { field: 'usuconfirmado', header: 'Confirmación email'},
        { field: 'perestado', header: 'Estado' },
    ];

    statusOptions = [
        { label: 'Activo', value: 1 },
        { label: 'Inactivo', value: 0 }
    ];

    statusConfirmEmail = [
        { label: 'Confirmado', value: 1 },
        { label: 'No Confirmado', value: 0 }
    ];

    rolOptions = [];

    constructor( private messageService: MessageService, private usuarioService: UsuarioService, private authService: AuthService, private reporte: ReporteService, private formBuilder: FormBuilder, private spinner: NgxSpinnerService, private archivoService: ArchivosService)
    {
        this.colsColumsTable = [
            { field: 'usuname', header: 'Nombre de usuario' },
            { field: 'usuemail', header: 'Correo electrónico' },
            { field: 'rolnombre', header: 'Rol de usuario' },
            { field: 'usudescripcion', header: 'Observación'},
            { field: 'usuusureg', header: 'Registrado' },
            { field: 'usuusumod', header: 'Modificado' },
            { field: 'usuestado', header: 'Estado' },
        ];

        this.selectedColumns = [
            { field: 'usuname', header: 'Nombre de usuario' },
            { field: 'usuemail', header: 'Correo electrónico' },
            { field: 'rolnombre', header: 'Rol de usuario' },
            { field: 'usudescripcion', header: 'Observación'},
            { field: 'usuconfirmado', header: 'Confirmación' },
            { field: 'usuestado', header: 'Estado' },
        ];
    }

    ngOnInit() {

        this.stateOptionsEstado = [
            { label: 'Activo', value: 1 },
            { label: 'Inactivo', value: 0 }
        ];

        this.items = [
            { label: 'Usuarios'},
            { label: 'Gestionar Usuarios', routerLink:''},
        ];

        this.home = { icon: 'pi pi-home', routerLink: '/' };

        this.getUserData();
        this.listarUsuarios();
        this.listarPersonaCombo();

        this.usuarioForm = this.formBuilder.group({
            usuid: [''],
            usuname: [ '', [Validators.required, Validators.minLength(5), Validators.maxLength(20), this.validateNotSpaces], [this.validateExistingUserName()]],
            tipoPersona: ['', Validators.required],
            tipoRol: ['', Validators.required],
            usuemail: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
            usudescripcion: [''],
            usuestado: ['', Validators.required],
        });

        this.usuarioPwdForm = this.formBuilder.group({
            usupassword: ['', [Validators.required, Validators.minLength(8), this.securityPassword]],
            usupassword2: ['', [Validators.required]]
        }, { validator: this.validatorPasswords });

        this.colsTable = [
            { field: 'usuid', header: 'ID' },
            { field: 'usuname', header: 'Nombre de usuario' },
            { field: 'pernomcompleto', header: 'Nombre completo' },
            { field: 'pernrodoc', header: 'Nro. doc.' },
            { field: 'usuemail', header: 'Email' },
            { field: 'rolnombre', header: 'Rol' },

            { field: 'usudescripcion', header: 'Descripcion' },
            { field: 'usuusureg', header: 'Registro' },
            // { field: 'usufecreg', header: 'Fecha' },
            { field: 'usuusumod', header: 'Modificación' },
            // { field: 'usufecmod', header: 'Fecha' }
            { field: 'usuestado', header: 'Estado' },
        ];

        this.exportColumns = this.colsTable.map((col) => ({ title: col.header, dataKey: col.field }));

        this.usuarioService.getRoles().subscribe(
            (result: any) => {
                this.rolOptions = result.map((rol: any) => ({
                    label: rol.rolnombre,
                    value: rol.rolnombre
                }));
            },
            (error) => {
                console.error('Error al obtener los roles:', error);
            }
        );
    }

    //  Funciones
    // Lista a los usuarios
    listarUsuarios(){
        this.spinner.show();
        this.loading = true;
        this.usuarioService.listaUsuario().subscribe(
            (result: any) => {
                this.usuarios = result;
                this.usuariosDuplicado = this.usuarios;
                this.filteredUsuarios = this.usuarios;
                this.loading = false;
                this.spinner.hide();
            },
            (error: any) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrío un error al recuperar información del sistema.', life: 3000 });
                this.loading = false;
                this.spinner.hide();
            }
        )
    }

    // Lista los roles para el combo de opciones
    listarRolCombo() {
        this.usuarioService.getRoles().subscribe(
            (result: any) => {
                this.tipoRol = result;
                if(this.datosUsuario?.rolid == 2){
                    this.tipoRol = this.tipoRol.filter(usuario => usuario.rolid !== 1);

                    this.rolOptions = result.map((rol: any) => ({
                        label: rol.rolnombre, // o el nombre que prefieras mostrar
                        value: rol.rolnombre  // o el valor que prefieras usar
                    }));
                }
            },
            (error) => {
                console.error('Error al obtener los roles:', error);
            }
        );
    }

    // lista las personas para el combo de opciones
    listarPersonaCombo(){
        this.usuarioService.getTipoPersona().subscribe(
            (result: any) => {
                this.tipoPersona = result;
            }
        )
    }

    // filtra los usuarios por su nombre completo
    filtarUsuarios(){
        this.filteredUsuarios = this.usuarios.filter(usuario => usuario.pernomcompleto.toLowerCase().includes(this.searchText.toLowerCase()));
    }

    // Abre el modal para nueva persona
    createUser() {
        this.usuario = new Usuario();
        this.usuarioRegistro = new Usuario();
        this.usuarioDialog = true;
        this.optionDialog = true;
        this.usuarioForm.reset();
    }

    // Edita los datos del usuario
    updateUser(data: Usuario){
        this.usuario = { ...data };
        this.usuarioDialog = true;
        this.optionDialog = false;
        this.originalUsername = this.usuario.usuname;

        this.usuarioForm.patchValue({
            usuid: this.usuario.usuid,
            usuname: this.usuario.usuname,
            tipoPersona: new TipoPersona2(this.usuario.perid, this.usuario.pernomcompleto, this.usuario.pernrodoc, this.usuario.perfoto),
            tipoRol: new TipoRol(this.usuario.rolid, this.usuario.rolnombre),
            usuemail: this.usuario.usuemail,
            usudescripcion: this.usuario.usudescripcion,
            usuestado: this.usuario.usuestado
        });

        const usunameControl = this.usuarioForm.get('usuname');
        usunameControl.clearAsyncValidators();

        if (this.originalUsername) {
            usunameControl.setAsyncValidators([this.validateUsernameIfChange.bind(this)]);
        }
        usunameControl.updateValueAndValidity();
    }

    // Enviar información para editar/crear usurario
    sendForm(){
        if (this.optionDialog) {
            if(this.usuarioForm.invalid){
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Por favor, verifica la información ingresada e intenta nuevamente.', life: 3000 });
                return Object.values(this.usuarioForm.controls).forEach(control=>{ control.markAllAsTouched(); control.markAsDirty(); })
            }
            this.usuarioRegistro = new Usuario();
            this.usuarioRegistro.tipo = 1;
            this.usuarioRegistro.usuid = null;
            this.usuarioRegistro.perid = this.usuarioForm.value.tipoPersona.perid;
            this.usuarioRegistro.rolid = this.usuarioForm.value.tipoRol.rolid;
            this.usuarioRegistro.usuname = this.usuarioForm.value.usuname;
            this.usuarioRegistro.usuemail = this.usuarioForm.value.usuemail;
            this.usuarioRegistro.usuestado = 1;
            this.usuarioRegistro.usuusureg = this.datosUsuario.usuname;
            this.usuarioRegistro.usudescripcion = this.usuarioForm.value.usudescripcion;
            this.usuarioService.gestionarUsuario(this.usuarioRegistro).subscribe(
                (result: any) => {
                    this.messageService.add({ severity: 'success', summary: 'Usuario', detail: 'Se registro correctamente.', life: 5000});
                    this.optionDialog = false;
                    this.usuarioDialog = false;
                    this.listarUsuarios();
                },
                (error) => {
                    console.error("error: ", error);
                    let errorMessage = 'Se produjo un error al intentar registrar el usuario.';
                    if (error.error.message.includes('UniqueViolation')) {
                        errorMessage = 'Ya existe un registro con el mismo rol para esta persona.';
                    }

                    this.messageService.add({ severity: 'error', summary: 'Usuario', detail: errorMessage, life: 7000});
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
            this.usuarioRegistro.usuid = this.usuarioForm.value.usuid;
            this.usuarioRegistro.usuname = this.usuarioForm.value.usuname;
            this.usuarioRegistro.usuemail = this.usuarioForm.value.usuemail;
            this.usuarioRegistro.perid = this.usuarioForm.value.tipoPersona.perid;
            this.usuarioRegistro.rolid = this.usuarioForm.value.tipoRol.rolid;
            this.usuarioRegistro.usuestado = 1;
            this.usuarioRegistro.usuusureg = this.datosUsuario.usuname;
            this.usuarioRegistro.usudescripcion = this.usuarioForm.value.usudescripcion;
            this.usuarioService.gestionarUsuario(this.usuarioRegistro).subscribe(
                (result: any) => {
                    this.messageService.add({ severity: 'success', summary: 'Persona', detail: 'Se modificado correctamente.', life: 3000});
                    this.optionDialog = false;
                    this.usuarioDialog = false;
                    this.listarUsuarios();
                },
                (error) => {
                    console.error("error: ", error);
                    let errorMessage = 'Se produjo un error al intentar modificar el usuario.';
                    if (error.error.message.includes('UniqueViolation')) {
                        errorMessage = 'No se puede modificar el usuario porque ya existe un registro con el mismo rol para esta persona.';
                    }

                    this.messageService.add({ severity: 'error', summary: 'Error en el Registro', detail: errorMessage, life: 7000});
                }
            )
        }
    }

    // Abre modal para desactivar usuario
    confirmDeactivate(data: Usuario){
        this.deactivateUserDialog = true;
        this.usuario = { ...data };
    }
    // Abre modal para activar usuario
    confirmActivate(data: any) {
        this.usuario = { ...data };
        this.activateUserDialog = true;
    }
    // Abre modal para cambiar contraseña
    confirmChangePassword(data: Usuario){
        this.usuarioPwdForm.patchValue(
            {
                usupassword: null,
                usupassword2: null
            }
        )
        this.usuarioCambiarPasswordDialog = true;
        this.usuario = { ...data };
    }

    // Edita contraseña
    changeUserPassword(){
        if(this.usuarioPwdForm.invalid){
            this.messageService.add({ severity: 'error', summary: 'Error en el Registro', detail: 'Por favor, verifica la información ingresada e intenta nuevamente.', life: 3000 });
            return Object.values(this.usuarioPwdForm.controls).forEach(control=>{ control.markAllAsTouched(); control.markAsDirty(); })
        }
        this.usuarioRegistro = new Usuario();
        this.usuarioRegistro = { ...this.usuario};
        this.usuarioRegistro.usupassword = this.usuarioPwdForm.value.usupassword;
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

    // Desactiva usuario
    deactivateUser() {
        this.usuarioRegistro = new Usuario();
        this.usuarioRegistro = { ...this.usuario};
        this.usuarioRegistro.tipo = 2;
        this.usuarioRegistro.usuusumod = this.datosUsuario.usuname;
        this.usuarioService.gestionarUsuarioEstado(this.usuarioRegistro).subscribe(
            (result: any) => {
                this.messageService.add({ severity: 'success', summary: 'Proceso realizado correctamente', detail: 'Usuario Desactivado.', life: 3000});
                this.deactivateUserDialog = false;
                this.listarUsuarios();
            },
            (error) => {
                this.errors = error;
                this.messageService.add({ severity: 'error', summary: 'Error de proceso', detail: 'Se produjo un error al intentar desactivar el usuario.', life: 3000});
            }
        )
    }

    // Activa usuario
    activateUser() {
        this.usuarioRegistro = new Usuario();
        this.usuarioRegistro = { ...this.usuario};
        this.usuarioRegistro.tipo = 3;
        this.usuarioRegistro.usuusumod = this.datosUsuario.usuname;
        this.usuarioService.gestionarUsuarioEstado(this.usuarioRegistro).subscribe(
            (result: any) => {
                this.messageService.add({ severity: 'success', summary: 'Proceso realizado correctamente', detail: 'Usuario Activado.', life: 3000});
                this.activateUserDialog = false;
                this.listarUsuarios();
            },
            (error) => {
                this.errors = error;
                this.messageService.add({ severity: 'error', summary: 'Error de proceso', detail: 'Se produjo un error al intentar activar el usuario.', life: 3000});
            }
        )
    }

    // oculta model de editar/crear usuario
    hideDialog(){
        this.usuarioDialog = false;
        this.usuarioCambiarPasswordDialog = false;
        this.usuarioPwdForm.reset();
    }



    // Funciones para validaciones
    // Verifica que la contraseña: debe incluir mayúsculas, minúsculas y números
    securityPassword(control: AbstractControl): { [key: string]: boolean } | null {
      const value = control.value;
      if (value && (!value.match(/[A-Z]/) || !value.match(/[a-z]/) || !value.match(/[0-9]/))) {
        return { securityPassword: true };
      }
      return null;
    }
    // Verifica si las contraseña y repetir la contraseña sean iguales
    validatorPasswords(fg: FormGroup): { [key: string]: boolean } | null {
        const password = fg.get('usupassword').value;
        const confirmPassword = fg.get('usupassword2').value;
        if (password && confirmPassword && password !== confirmPassword) {
            return { mismatch: true };
        }
        return null;
    }
    // Verifica que el texto no tenga espacios
    validateNotSpaces(control: AbstractControl) {
        const valor = control.value;
        if (valor?.includes(' ')) {
          return { espaciosNoPermitidos: true };
        }
        return null;
    }
    // Verifica que el texto inicie con una letra
    validateCorrectStart(control: AbstractControl) {
        const valor = control.value;
        if (valor && !valor.match(/^[a-zA-Z]/)) {
          return { inicioInvalido: true };
        }
        return null;
    }
    // Verifica si exite el nombre
    validateExistingUserName(): AsyncValidatorFn {
        return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
            const nombreUsuario = control.value;
            if (!nombreUsuario) {
                return of(null);
            }
            const existe = this.usuariosDuplicado.some(usuario => usuario.usuname === nombreUsuario);
            return of(existe ? { nombreUsuarioExiste: true } : null);
        }
    }
    // Verifica si el nombre de usuario cambia o no para realizar la busqueda si existiera
    validateUsernameIfChange(control: AbstractControl) {
        if (control.value === this.originalUsername) {
            return of(null);
        } else {
            return this.validateExistingUserName()(control);
        }
    }

    // Usuario
    // obtiene los datos del usuario logeado
    getUserData() {
        this.authService.usuario$.subscribe((user => {
            if (user) {
                if (Array.isArray(user) && user.length > 0) {
                    this.datosUsuario = user[0];
                    this.listarRolCombo();
                }
            }
        }));
    }


    // Otras fucniones
    // Filtra desde la tabla principal
    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }
    // Obtiene el color del estado
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
    // Obtiene la descripción del estado
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

    getSeverityConfirmEmail(estado: number): string {
        switch (estado) {
            case 1:
                return 'info';
            case 0:
                return 'danger';
            default:
                return 'danger';
        }
    }
    // Obtiene la descripción del estado
    getDescriptionConfirmEmail(estado: number): string {
        switch (estado) {
            case 1:
                return 'Confirmado';
            case 0:
                return 'No Confirmado';
            default:
                return 'No Confirmado';
        }
    }


    // Fucniones para exportar en documentos PDF y/o Excel
    // Exporta en PDF
    exportPdf() {
        import('jspdf').then(jsPDF => {
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF.default('l', 'pt', 'a4');

                // Título centrado
                const title = 'Lista de Usuarios';
                const titleFontSize = 16;
                const titleWidth = doc.getStringUnitWidth(title) * titleFontSize / doc.internal.scaleFactor;
                const titleX = (doc.internal.pageSize.getWidth() - titleWidth) / 2;
                const titleY = 60;
                doc.setFontSize(titleFontSize);
                doc.text(title, titleX, titleY);

                // Subtítulo
                const subtitle = 'Esta lista muestra todos los usuarios registradas en el sistema.';
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
                (doc as any).autoTable(
                    { columns: this.exportColumns,
                      body: this.usuariosDuplicado,
                      theme: 'striped',
                      styles: { fontSize: 8, cellPadding: 3 },
                    startY: 100, }); // Posición inicial de la tabla
                let PDF_EXTENSION = '.pdf';
                const nombreArchivo = 'rpt-pdf-lista-usuario-' + new Date().getTime()+PDF_EXTENSION;
                doc.save(nombreArchivo); // Guardar el archivo PDF con el nuevo nombre
            });
        });
    }

    // Export Excel
    exportExcel() {
        import('xlsx').then((xlsx) => {
            const fieldsToExport = [
                { field: 'usuid', header: 'ID' },
                { field: 'usuname', header: 'Usuario' },
                { field: 'pernomcompleto', header: 'Nombre completo' },
                { field: 'pernrodoc', header: 'Nro. doc.' },
                { field: 'usuemail', header: 'Email' },
                { field: 'rolnombre', header: 'Rol' },
                { field: 'usuestado', header: 'Estado' },
                { field: 'usudescripcion', header: 'Descripción' },
                { field: 'usuusureg', header: 'Registro' },
                { field: 'usufecreg', header: 'Fecha de registro' },
                { field: 'usuusumod', header: 'Modificado' },
                { field: 'usufecmod', header: 'Fecha de modificado' },
            ];

            const dataToExport = this.usuariosDuplicado.map(usuario => {
                const filteredData = {};
                fieldsToExport.forEach(field => {
                    if (field.field === 'usufecreg' || field.field === 'usufecmod') {
                        filteredData[field.header] = usuario[field.field] ? new Date(usuario[field.field]).toLocaleString() : '';
                    } else {
                        filteredData[field.header] = usuario[field.field] || '';
                    }
                });
                return filteredData;
            });

            const worksheet = xlsx.utils.json_to_sheet(dataToExport);


            // Calcular el ancho de las columnas basado en el contenido más largo
            const columnWidths = fieldsToExport.map(field => {
                const columnData = dataToExport.map(row => row[field.header]);
                const maxLength = columnData.reduce((acc, val) => Math.max(acc, val.toString().length), 0);
                return { wch: maxLength + 2 }; // Puedes ajustar el factor de ajuste según tus necesidades
            });

            worksheet['!cols'] = columnWidths;

            const workbook = { Sheets: { 'Data': worksheet }, SheetNames: ['Data'] };
            const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
            this.saveAsExcelFile(excelBuffer, 'rpt-excel-lista-usuario-');
        });

    }

    saveAsExcelFile(buffer: any, fileName: string): void {
        let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        let EXCEL_EXTENSION = '.xlsx';
        const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
        FileSaver.saveAs(data, fileName + new Date().getTime() + EXCEL_EXTENSION);
    }
}
