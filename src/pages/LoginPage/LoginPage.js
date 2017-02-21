var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { LoginProvider } from '../../providers/LoginProvider';
import { QuestPage } from '../QuestPage/QuestPage';
import { NavController, NavParams } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { ServerIpProvider } from '../../providers/ServerIpProvider';
import { InAppBrowser } from 'ionic-native';
/*
  Generated class for the LoginPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
var LoginPage = (function () {
    function LoginPage(http, navCtrl, navParams, loginProvider, serverIpProvider) {
        this.http = http;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.loginProvider = loginProvider;
        this.serverIpProvider = serverIpProvider;
    }
    LoginPage.prototype.doGoogleLogin = function () {
        var _this = this;
        var head = { 'Content-Type': 'text/plain' };
        var headers = new Headers(head);
        var options = new RequestOptions({ headers: headers });
        this.http.post(this.serverIpProvider.getServerIp() + "/LoginPairCode", "", options)
            .subscribe(function (res) {
            var resp = res.json();
            console.log(resp);
            _this.loginProvider.setPairCode(resp.code);
            _this.browser = new InAppBrowser(encodeURI(_this.serverIpProvider.getServerIp() + "/static/Pair.html?c=" + resp.code), '_system', 'hardwareback=no');
            document.getElementById('LoginLoading').innerText = "Verifying login...";
            _this.watch = setInterval((function (self) {
                return function () {
                    self.watchLogin(); //Thing you wanted to run as non-window 'this'
                };
            })(_this), 5000);
        });
    };
    LoginPage.prototype.watchLogin = function () {
        var _this = this;
        var head = { 'Content-Type': 'text/plain' };
        var headers = new Headers(head);
        var options = new RequestOptions({ headers: headers });
        this.http.post(this.serverIpProvider.getServerIp() + "/LoginPairCheck", JSON.stringify({ stoken: this.loginProvider.getPairCode(), type: "GOOGLE" }), options)
            .subscribe(function (res) {
            var resp = res.json();
            if (resp.Ok == 2) {
                clearInterval(_this.watch);
                _this.loginProvider.setToken(resp.Token);
                _this.loginProvider.setType("GOOGLE");
                localStorage.setItem("AuthToken", resp.Token);
                localStorage.setItem("AuthType", "GOOGLE");
                document.getElementById('LoginLoading').innerText = "Verified";
                //this.browser.close();
                _this.navCtrl.setRoot(QuestPage);
            }
            else {
                if (resp.Ok == 0) {
                    clearInterval(_this.watch);
                    document.getElementById('LoginLoading').innerText = "Error. Try again!";
                }
            }
        });
    };
    LoginPage.prototype.ionViewDidLoad = function () {
        var _this = this;
        var head = { 'Content-Type': 'text/plain' };
        var headers = new Headers(head);
        var options = new RequestOptions({ headers: headers });
        this.http.post(this.serverIpProvider.getServerIp() + "/VerifyLogin", JSON.stringify({ id_token: localStorage.getItem("AuthToken"), id_token_type: localStorage.getItem("AuthType") }), options)
            .subscribe(function (res) {
            var resp = res.json();
            if (resp.Ok == 0) {
                _this.loginProvider.setToken(localStorage.getItem("AuthToken"));
                _this.loginProvider.setType(localStorage.getItem("AuthType"));
                document.getElementById('LoginLoading').innerText = "Success! Redirecting...";
                _this.navCtrl.setRoot(QuestPage);
            }
            else {
                document.getElementById('LoginLoading').innerText = "Please log in!";
            }
        });
        console.log('ionViewDidLoad LoginPage');
    };
    return LoginPage;
}());
LoginPage = __decorate([
    Component({
        selector: 'page-login',
        templateUrl: 'LoginPage.html'
    }),
    __metadata("design:paramtypes", [Http,
        NavController,
        NavParams,
        LoginProvider,
        ServerIpProvider])
], LoginPage);
export { LoginPage };
//# sourceMappingURL=LoginPage.js.map