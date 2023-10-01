import { Injectable } from '@angular/core';
import jwt_decode from "jwt-decode";

export const idServicio: string = 'e239d100-a591-4d31-accd-142becbbf4cc';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  funcionesUsuario: any[] = [];

  constructor() { }

  setConfiguracion(){
    // en caso de dudas puede revisar el contenido del token obtenido en https://jwt.io/
    let token: any = localStorage.getItem("token")
    if (token){
      let decode:any = jwt_decode(token)
      let claims = decode['user_claims']
      if (claims){       
        let servicio: any[] = claims.filter((o: any)=> {return o.idServicio === idServicio})        

        if(servicio.length === 0){
          this.funcionesUsuario = [];          
          return 1; // agregar ruteo de ser necesario
        }
        let funciones: any[] = [];
        for(let i = 0; i < servicio[0]['funciones'].length; i++){
          funciones.push(servicio[0]['funciones'][i])
        }        
        this.funcionesUsuario = funciones;
        // console.log(funciones)
      }
    }
    return 0// ajustar por un router link, cuando no existe token se redireccione a otro lado  
  }

  getIdUsuario(){
    if (this.isAuthenticated()){
      const token: any = this.getAuthenticatedToken();
      let decode:any = (jwt_decode(token));
      return decode['identity']['idUsuario'];  
    }
    return []
  }

  getUsername(){
    if (this.isAuthenticated()){
      const token: any = this.getAuthenticatedToken();
      let decode:any = (jwt_decode(token));
      return decode['identity']['username'];  
    }
    return []
  }

  getAuthenticatedToken() {
    if (this.isAuthenticated()) {
      return localStorage.getItem("token");
    }
    return ''
  }

  isAuthenticated() {
    const sesion = localStorage.getItem("token");
    return !(sesion === null);
  }
}
