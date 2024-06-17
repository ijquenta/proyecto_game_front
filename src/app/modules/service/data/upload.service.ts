import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { checktoken } from 'src/app/interceptors/token.interceptor';
import { API_URL } from 'src/environments/environment';

@Injectable()

export class UploadService {

    constructor(private http: HttpClient) { }

    uploadProfilePhoto(criterio: any){
        return this.http.post(`${API_URL}/profilePhoto/upload`, criterio, { context: checktoken()});
    }

    deleteProfilePhoto(filename: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
          this.http.post(`${API_URL}/profilePhoto/delete`, { filename } , { context: checktoken() }).subscribe({
            next: (data: any) => {
              if (data.status === 'success') {
                resolve(true);
              } else {
                resolve(false);
              }
            },
            error: (error) => {
              console.error('Error en la eliminación:', error);
              resolve(false);
            }
          });
        });
    }


    uploadFilesPago(criterio: any){
        return this.http.post(`${API_URL}/pago/upload`, criterio);
    }

    uploadFilesTexto(criterio: any){
        return this.http.post(`${API_URL}/texto/upload`, criterio);
    }
}
