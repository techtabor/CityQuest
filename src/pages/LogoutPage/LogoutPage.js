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
import { LoginPage } from '../LoginPage/LoginPage';
import { NavController, NavParams } from 'ionic-angular';
import { InAppBrowser } from 'ionic-native';
import { ServerIpProvider } from '../../providers/ServerIpProvider';
/*
  Generated class for the Logout page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
var LogoutPage = (function () {
    function LogoutPage(navCtrl, navParams, serverIpProvider) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.serverIpProvider = serverIpProvider;
    }
    LogoutPage.prototype.doGoogleLogout = function () {
        //this.googleAuth.logout();
        var browser = new InAppBrowser(encodeURI(this.serverIpProvider.getServerIp() + "/static/Logout.html"), '_system', 'hardwareback=no');
        this.navCtrl.setRoot(LoginPage);
    };
    LogoutPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad LogoutPage');
    };
    return LogoutPage;
}());
LogoutPage = __decorate([
    Component({
        selector: 'page-logout',
        templateUrl: 'LogoutPage.html'
    }),
    __metadata("design:paramtypes", [NavController,
        NavParams,
        ServerIpProvider])
], LogoutPage);
export { LogoutPage };
//# sourceMappingURL=LogoutPage.js.map