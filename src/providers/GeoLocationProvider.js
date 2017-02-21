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
import { Geolocation } from 'ionic-native';
import 'rxjs/add/operator/map';
/*
  Generated class for the GeoLocation provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
var GeoLocationProvider = (function () {
    function GeoLocationProvider(http) {
        var _this = this;
        this.http = http;
        this.watchId = Geolocation.watchPosition()
            .subscribe(function (position) {
            _this.geoData = position.coords;
        });
        console.log('Hello GeoLocation Provider');
    }
    GeoLocationProvider.prototype.getLocation = function () {
        return this.geoData;
    };
    return GeoLocationProvider;
}());
GeoLocationProvider = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Http])
], GeoLocationProvider);
export { GeoLocationProvider };
//# sourceMappingURL=GeoLocationProvider.js.map