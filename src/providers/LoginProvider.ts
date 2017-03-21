import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Login } from '../models/Login';
import 'rxjs/add/operator/map';
/*
  Generated class for the GeoLocation provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class LoginProvider {
  token: string;
  type: string;
  pair: string;
  constructor(public http: Http) {
  }

  getType(): string {
    return this.type;
  }

  getToken(): string {
    return this.token;
  }

  getPairCode(): string {
    return this.pair;
  }

  setType(s): void {
    localStorage.setItem("AuthType", s);
    this.type=s;
  }

  setToken(s): void {
    localStorage.setItem("AuthToken", s);
    this.token=s;
  }

  setPairCode(s): void {
    this.pair=s;
  }

  load(): void {
    this.type = localStorage.getItem("AuthType");
    this.token = localStorage.getItem("AuthToken");
  }
}
