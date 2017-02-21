var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { GeoLocationProvider } from '../../providers/GeoLocationProvider';
/*
  Generated class for the Stats page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
var StatsPage = (function () {
    function StatsPage(navCtrl, geoLocationProvider) {
        this.navCtrl = navCtrl;
        this.geoLocationProvider = geoLocationProvider;
        this.geo = geoLocationProvider;
        setInterval((function (self) {
            return function () {
                self.GeoC(); //Thing you wanted to run as non-window 'this'
            };
        })(this), 1000);
    }
    StatsPage.prototype.GeoC = function () {
        if (document.getElementById("gdiv") != null) {
            document.getElementById("gdiv").innerText = this.geo.getLocation().latitude + " " + this.geo.getLocation().longitude;
        }
    };
    StatsPage.prototype.ionViewDidLoad = function () {
        console.log('Hello StatsPage Page');
    };
    return StatsPage;
}());
StatsPage = __decorate([
    Component({
        selector: 'page-stats',
        templateUrl: 'StatsPage.html'
    }),
    __metadata("design:paramtypes", [NavController, GeoLocationProvider])
], StatsPage);
export { StatsPage };
//# sourceMappingURL=StatsPage.js.map