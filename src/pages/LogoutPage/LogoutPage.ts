import { Component } from '@angular/core';
import { LoginPage } from '../LoginPage/LoginPage';
import { NavController, NavParams } from 'ionic-angular';

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
  nav: NavController;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.nav = navCtrl;
  }

  logout() {
    document.getElementById("GoogleLogout").click();
    document.getElementById("GoogleData").innerText = "";
    this.nav.setRoot(LoginPage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LogoutPage');
  }

}
