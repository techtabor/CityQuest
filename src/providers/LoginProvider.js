var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
/*
  Generated class for the GeoLocation provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
var LoginProvider = (function () {
    function LoginProvider(http) {
        this.http = http;
    }
    LoginProvider.prototype.getType = function () {
        return this.type;
    };
    LoginProvider.prototype.getToken = function () {
        return this.token;
    };
    LoginProvider.prototype.getPairCode = function () {
        return this.pair;
    };
    LoginProvider.prototype.setType = function (s) {
        this.type = s;
    };
    LoginProvider.prototype.setToken = function (s) {
        this.token = s;
    };
    LoginProvider.prototype.setPairCode = function (s) {
        this.pair = s;
    };
    return LoginProvider;
}());
LoginProvider = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Http])
], LoginProvider);
export { LoginProvider };
//# sourceMappingURL=LoginProvider.js.map