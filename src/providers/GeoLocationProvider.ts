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
  geoData: any;
  hasData: boolean;
  watch: any = Geolocation.watchPosition().subscribe(position => {
      this.geoData = position.coords;
      this.hasData = true;
    }
  );
  constructor(
    public http: Http
  ) {
    console.log('Hello GeoLocation Provider');
    this.hasData = false;
  }

  getLocation(): any {
    return this.geoData;
  }
  getHasData(): boolean {
    return this.hasData;
  }
}
