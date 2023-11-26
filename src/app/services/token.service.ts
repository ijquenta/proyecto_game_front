
import { Injectable } from '@angular/core';
import { getCookie, setCookie, removeCookie } from 'typescript-cookie';
import jwt_decode, { JwtPayload } from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

  // Guardando en LocalStorage
  saveToken(token: string) {
    // console.log("SaveToken: ", token);
    // localStorage.setItem("token", token);
    setCookie('token', token, {expires: 365, path: '/'});
  }

  // Obtener Token
  getToken(){
    // const token = localStorage.getItem("token");
    const token = getCookie('token');
    // console.log("getToken: ", token);
    return token
  }

  // Remover Token
  removeToken(){
    // console.log("RemoveToken");
    // localStorage.removeItem("token");
    removeCookie('token');
  }

  isValidToken(){
    const token = this.getToken();
    if(!token){
        return false;
    }
    const decodeToken = jwt_decode<JwtPayload>(token);
    // console.log("isvalidToken DecodeToken: ", decodeToken);
    if (decodeToken && decodeToken?.exp){
        const tokenDate = new Date(0);
        tokenDate.setUTCSeconds(decodeToken.exp);
        const today = new Date();
        return tokenDate.getTime() > today.getTime();
    }
    return true;
  }
}
