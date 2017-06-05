import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Geolocation } from '@ionic-native/geolocation';
import 'rxjs/add/operator/map';

/*
  Generated class for the GeoLocation provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class GeoLocationProvider {
  geoData: any = false;
  hasData: boolean;
  watch: any;
  constructor(
    public http: Http,
    public geoLocation : Geolocation
  ) {
    console.log('Hello GeoLocation Provider');
    this.hasData = false;
    /*this.watch = this.geoLocation.watchPosition();
    this.watch.subscribe((data) => {
     this.geoData = data.coords;
     this.hasData = true;
   });*/
    if (navigator.geolocation) {
      var options = {
        enableHighAccuracy: true
      };

      navigator.geolocation.watchPosition(position=> {
        this.geoData = position.coords;
        this.hasData = true;
      }, error => {
        alert(error);
      }, options);
    }
  }

  getLocation(): any {
    return this.geoData;
  }
  getHasData(): boolean {
    return this.hasData;
  }
}
