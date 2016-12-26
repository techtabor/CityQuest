import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

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

  constructor(public navCtrl: NavController) {

  }

  ionViewDidLoad() {
    let node = document.createElement('script');
    node.src = "https://apis.google.com/js/platform.js";
    node.type = 'text/javascript';
    node.async = true;
    node.charset = 'utf-8';
    document.getElementsByTagName('head')[0].appendChild(node);
    console.log('Hello StatsPage Page');
  }

}
