import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Geolocation } from 'ionic-native';
import 'rxjs/add/operator/map';

/*
  Generated class for the GeoLocation provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class GeoLocationProvider {
  watchId: any = Geolocation.watchPosition()
                              .subscribe(position => {
  this.geoData = position.coords;
});
  geoData: any;
  constructor(public http: Http) {
    console.log('Hello GeoLocation Provider');
  }

  getLocation(): any {
    return this.geoData;
  }
}
