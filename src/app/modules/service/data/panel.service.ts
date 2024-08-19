import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from 'src/environments/environment';
import { checktoken } from 'src/app/interceptors/token.interceptor';
import { NgxSpinnerService } from 'ngx-spinner';

const httpOptions = {
    responseType: 'arraybuffer' as 'json',
};

@Injectable({
    providedIn: 'root',
})
export class PanelService {
    usuario: any;
    constructor(private http: HttpClient, private spinner: NgxSpinnerService) {}
}
