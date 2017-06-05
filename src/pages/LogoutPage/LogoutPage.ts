import { Component } from '@angular/core';
import { LoginPage } from '../LoginPage/LoginPage';
import { LoginProvider } from '../../providers/LoginProvider';
import { NavController, NavParams } from 'ionic-angular';
import {InAppBrowser} from 'ionic-native';
import { ServerIpProvider } from '../../providers/ServerIpProvider';
import { GeoLocationProvider} from '../../providers/GeoLocationProvider';
/*
  Generated class for the Logout page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-logout',
  templateUrl: 'LogoutPage.html'
})
export class LogoutPage {
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public serverIpProvider: ServerIpProvider,
    public geoLocationProvider: GeoLocationProvider,
    public loginProvider: LoginProvider
  ) {
  }

  doGoogleLogout() {
    this.loginProvider.setType("");
    this.loginProvider.setToken("");
    this.loginProvider.setPairCode("");
    //this.googleAuth.logout();
    let browser = new InAppBrowser(encodeURI(`${this.serverIpProvider.getServerIp()}/static/Logout.html`), '_system', 'hardwareback=no');
    this.navCtrl.setRoot(LoginPage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LogoutPage');
    //document.getElementById("geoGataDiv").innerText = JSON.stringify(this.geoLocationProvider.getHasData()) + "; " + JSON.stringify(this.geoLocationProvider.getLocation());
  }

}
