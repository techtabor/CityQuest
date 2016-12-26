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
  constructor(public http: Http) {
  }

  getToken(): string {
    return document.getElementById('GoogleData').innerText;
  }

  getType(): string {
    return "GOOGLE";
  }
}
