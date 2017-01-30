import { Component } from '@angular/core';
import { LoginProvider } from '../../providers/LoginProvider';
import { QuestPage } from '../QuestPage/QuestPage';
import { NavController, NavParams } from 'ionic-angular';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { ServerIpProvider } from '../../providers/ServerIpProvider';
import {InAppBrowser} from 'ionic-native';
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
  browser: any;
  constructor(
    public http: Http,
    public navCtrl: NavController,
    public navParams: NavParams,
    public loginProvider: LoginProvider,
    public serverIpProvider: ServerIpProvider
  ) {
  }

  doGoogleLogin() {/*
    document.getElementById('LoginLoading').innerText = "Verifying login...";
    document.getElementById('LoginLoading').innerText=JSON.stringify(this.googleAuth);
    this.googleAuth.login().then(
      function() {
        console.log("s");
        document.getElementById('LoginLoading').innerText = "Verified!";
        this.navCtrl.setRoot(QuestPage);
      },
      function(e) {
        console.log("e:");
        console.log(e);
        document.getElementById('LoginLoading').innerText = document.getElementById('LoginLoading').innerText+JSON.stringify(e);
      }
    );*/

    let head = {'Content-Type': 'text/plain'};
    let headers    = new Headers(head);
    let options    = new RequestOptions({headers: headers});
    this.http.post(`${this.serverIpProvider.getServerIp()}/PairReq`, "", options)
    .subscribe(res =>
      {
        let resp = res.json();
        console.log(resp);
        this.loginProvider.setPairCode(resp.code);
        this.browser = new InAppBrowser(encodeURI(`${this.serverIpProvider.getServerIp()}/static/Pair.html?c=` + resp.code), '_system', 'hardwareback=no');
        document.getElementById('LoginLoading').innerText = "Verifying login...";
        this.watch = setInterval(
          (
            function(self) {         //Self-executing func which takes 'this' as self
             return function() {   //Return a function in the context of 'self'
               self.watchLogin(); //Thing you wanted to run as non-window 'this'
             }
           }
         )(this),
        5000);
      }
    );
  }

  watchLogin() {
    let head = {'Content-Type': 'text/plain'};
    let headers    = new Headers(head);
    let options    = new RequestOptions({headers: headers});
    this.http.post(`${this.serverIpProvider.getServerIp()}/PairCheck`, JSON.stringify({stoken: this.loginProvider.getPairCode(), type: "GOOGLE"}), options)
    .subscribe(res =>
      {

        let resp = res.json();
        console.log(resp);
        if(resp.Ok == 2) {
          clearInterval(this.watch);
          this.loginProvider.setToken(resp.Token);
          this.loginProvider.setType("GOOGLE");
          document.getElementById('LoginLoading').innerText = "Verified";
          //this.browser.close();
          this.navCtrl.setRoot(QuestPage);
        } else {
          if(resp.Ok == 0) {
            clearInterval(this.watch);
            document.getElementById('LoginLoading').innerText = "Error. Try again!";
          }
        }
      }
    );
  }
/*
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
        document.getElementById('GoogleSignInContainer1').appendChild(document.getElementById('GoogleSignIn'));
        clearInterval(t.watch);
        t.nav.setRoot(QuestPage);
      }
    }
  }
*/
  ionViewDidLoad() {
    /*document.getElementById('GoogleSignInContainer2').appendChild(document.getElementById('GoogleSignIn'));
    let node = document.createElement('script');
    node.src = "https://apis.google.com/js/platform.js";
    node.type = 'text/javascript';
    node.async = true;
    node.charset = 'utf-8';
    document.getElementsByTagName('head')[0].appendChild(node);*/
    console.log('ionViewDidLoad LoginPage');
  }

}
