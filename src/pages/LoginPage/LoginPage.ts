import { Component } from '@angular/core';
import { QuestPage } from '../QuestPage/QuestPage';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the LoginPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-login',
  templateUrl: 'LoginPage.html'
})
export class LoginPage {
  watch: any;
  state: number;
  nav: NavController;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.state = 0;
    this.watch = setInterval(() => this.loginWatch(this), 1000);
    this.nav = navCtrl;
  }

  loginWatch(t): void {
    //console.log("L" + t.state);
    //console.log("L" + document.getElementById('GoogleData').innerText && t.state < 2);
    if(document.getElementById('GoogleData').innerText != "") {
      if(document.getElementById('GoogleData').innerText == "Loading" && t.state == 0) {
        document.getElementById('LoginLoading').innerText = "Verifying login...";
        t.state = 1;
        //console.log("U" + t.state);
      }
      if(document.getElementById('GoogleData').innerText != "Loading") {
        document.getElementById('LoginLoading').innerText = "Verified!";
        t.state = 2;
        //console.log("U" + t.state);
        clearInterval(t.watch);
        t.nav.setRoot(QuestPage);
      }
    }
  }

  ionViewDidLoad() {
    let node = document.createElement('script');
    node.src = "https://apis.google.com/js/platform.js";
    node.type = 'text/javascript';
    node.async = true;
    node.charset = 'utf-8';
    document.getElementsByTagName('head')[0].appendChild(node);
    console.log('ionViewDidLoad LoginPage');
  }

}
