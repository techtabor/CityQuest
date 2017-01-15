import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { GeoLocationProvider } from '../../providers/GeoLocationProvider';

/*
  Generated class for the Stats page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-stats',
  templateUrl: 'StatsPage.html'
})
export class StatsPage {
  geo: GeoLocationProvider;
  constructor(public navCtrl: NavController, public geoLocationProvider: GeoLocationProvider) {
    this.geo = geoLocationProvider;
    setInterval(
      (
        function(self) {         //Self-executing func which takes 'this' as self
         return function() {   //Return a function in the context of 'self'
           self.GeoC(); //Thing you wanted to run as non-window 'this'
         }
       }
     )(this),
    1000);
  }

  GeoC() {
    if(document.getElementById("gdiv") != null) {
      document.getElementById("gdiv").innerText = this.geo.getLocation().latitude + " " + this.geo.getLocation().longitude;
    }
  }

  ionViewDidLoad() {
    console.log('Hello StatsPage Page');
  }

}
