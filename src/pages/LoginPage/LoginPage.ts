import { Component } from '@angular/core';
import { LoginProvider } from '../../providers/LoginProvider';
import { QuestPage } from '../QuestPage/QuestPage';
import { NavController, NavParams } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
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
  canlogin: boolean;
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
    this.http.post(`${this.serverIpProvider.getServerIp()}/LoginPairCode`, "", options)
    .subscribe(res =>
      {
        let resp = res.json();
        console.log(resp);
        this.loginProvider.setPairCode(resp.code);
        this.browser = new InAppBrowser(encodeURI(`${this.serverIpProvider.getServerIp()}/static/Pair.html?c=` + resp.code), '_system', 'hardwareback=no');
        document.getElementById('LoginLoading').innerText = "Verifying login...";
        this.canlogin = false;
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
    this.http.post(`${this.serverIpProvider.getServerIp()}/LoginPairCheck`, JSON.stringify({stoken: this.loginProvider.getPairCode(), type: "GOOGLE"}), options)
    .subscribe(res =>
      {
        let resp = res.json();
        if(resp.Ok == 0) {
          clearInterval(this.watch);
          this.loginProvider.setToken(resp.Token);
          this.loginProvider.setType("GOOGLE");
          this.loginProvider.name = resp.Name;
          this.loginProvider.profilePic = resp.Picture;
          this.loginProvider.teamName = resp.TeamName;
          this.loginProvider.team = resp.Team;

          document.getElementById('LoginLoading').innerText = "Verified";
          //this.browser.close();
          this.navCtrl.setRoot(QuestPage);
        } else {
          if(resp.Ok == 1) {
            clearInterval(this.watch);
            document.getElementById('LoginLoading').innerText = "Error. Try again!";
            this.canlogin = true;
          }
        }
      }
    );
  }

  ionViewDidLoad() {
    this.canlogin = false;
    let head = {'Content-Type': 'text/plain'};
    let headers    = new Headers(head);
    let options    = new RequestOptions({headers: headers});
    this.loginProvider.load();
    this.http.post(`${this.serverIpProvider.getServerIp()}/VerifyLogin`, JSON.stringify({id_token: this.loginProvider.getToken(), id_token_type: this.loginProvider.getType()}), options)
    .subscribe(res =>
      {
        let resp = res.json();
        if(resp.Ok == 0) {
          this.loginProvider.name = resp.Name;
          this.loginProvider.profilePic = resp.Picture;
          this.loginProvider.teamName = resp.TeamName;
          this.loginProvider.team = resp.Team;
          document.getElementById('LoginLoading').innerText = "Success! Redirecting...";
          this.navCtrl.setRoot(QuestPage);
        } else {
          document.getElementById('LoginLoading').innerText = "Please log in!";
          this.canlogin = true;
        }
      }
    );
    console.log('ionViewDidLoad LoginPage');
  }

}
