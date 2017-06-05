import { Component } from '@angular/core';
import { LoginProvider } from '../../providers/LoginProvider';
import { QuestPage } from '../QuestPage/QuestPage';
import { NavController, NavParams } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { ServerIpProvider } from '../../providers/ServerIpProvider';
import { GeoLocationProvider } from '../../providers/GeoLocationProvider';
import { InAppBrowser } from 'ionic-native';

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
  Gwatch: any;
  watch: any;
  state: number;
  browser: any;
  canlogin: boolean;
  iter: number;
  constructor(
    public http: Http,
    public navCtrl: NavController,
    public navParams: NavParams,
    public loginProvider: LoginProvider,
    public serverIpProvider: ServerIpProvider,
    public geoLocationProvider: GeoLocationProvider
  ) {
  }

  doGoogleLogin() {
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
        this.iter = 0;
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
    document.getElementById('LoginLoading').innerText = "Verifying login..." + this.iter + " / 30";
    ++this.iter;
    if(this.iter > 30) {
      clearInterval(this.watch);
    }
    let head = {'Content-Type': 'text/plain'};
    let headers    = new Headers(head);
    let options    = new RequestOptions({headers: headers});

    var geoData    = this.geoLocationProvider.getLocation();

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

  watchGps() {
    if(this.geoLocationProvider.getHasData() == true) {
      clearInterval(this.Gwatch);
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
    } else {
      document.getElementById('LoginLoading').innerText = "Searching for location data...";
    }
  }

  ionViewDidLoad() {
    this.canlogin = false;
    this.Gwatch = setInterval(
      (
        function(self) {         //Self-executing func which takes 'this' as self
         return function() {   //Return a function in the context of 'self'
           self.watchGps(); //Thing you wanted to run as non-window 'this'
         }
       }
     )(this),
    500);
    console.log('ionViewDidLoad LoginPage');
  }

}
