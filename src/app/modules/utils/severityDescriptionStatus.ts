export function getSeverityStatus(status: number): string {
    switch (status) {
        case 1:
            return 'success';
        case 0:
            return 'danger';
        default:
            return 'info';
    }
}

export function getDescriptionStatus(status: number): string {
    switch (status) {
        case 1:
            return 'Activo';
        case 0:
            return 'Inactivo';
        default:
            return 'Ninguno';
    }

}
