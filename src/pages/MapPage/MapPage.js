var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { QuestShareService } from '../../services/QuestShareService';
/*
  Generated class for the Map page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
var MapPage = (function () {
    function MapPage(navCtrl, shareService) {
        this.navCtrl = navCtrl;
        this.shareService = shareService;
    }
    MapPage.prototype.ionViewDidLoad = function () {
        console.log('Hello MapPage page');
        this.loadMap();
    };
    MapPage.prototype.loadMap = function () {
        console.log('Loading map');
        var latLng = new google.maps.LatLng(this.shareService.getCurrentQuestion().Latitude, this.shareService.getCurrentQuestion().Longitude);
        var mapOptions = {
            center: latLng,
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
        var marker = new google.maps.Marker({
            position: latLng,
            map: this.map,
            title: 'Current Question'
        });
    };
    return MapPage;
}());
__decorate([
    ViewChild('map'),
    __metadata("design:type", ElementRef)
], MapPage.prototype, "mapElement", void 0);
MapPage = __decorate([
    Component({
        selector: 'page-map',
        templateUrl: 'MapPage.html'
    }),
    __metadata("design:paramtypes", [NavController,
        QuestShareService])
], MapPage);
export { MapPage };
//# sourceMappingURL=MapPage.js.map