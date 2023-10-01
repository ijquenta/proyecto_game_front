import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {

  private idRol!: number;
  private rol!: string;
  
  constructor() { }
  
  setIdRol(id: number) {
    this.idRol = id;
  }

  getIdRol() {
    return this.idRol;
  }

  setRol(rol: string) {
    this.rol = rol;
  }

  getRol() {
    return this.rol;
  }
}
