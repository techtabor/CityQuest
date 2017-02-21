var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild } from '@angular/core';
//import { GoogleAuth, User } from '@ionic/cloud-angular';
import { Platform, MenuController, Nav } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { MapPage } from '../pages/MapPage/MapPage';
import { StatsPage } from '../pages/StatsPage/StatsPage';
import { QuestPage } from '../pages/QuestPage/QuestPage';
import { LoginPage } from '../pages/LoginPage/LoginPage';
import { LogoutPage } from '../pages/LogoutPage/LogoutPage';
import { CreatePage } from '../pages/CreatePage/CreatePage';
import { QuestionPage } from '../pages/QuestionPage/QuestionPage';
import { QuestShareService } from '../services/QuestShareService';
var MyApp = (function () {
    function MyApp(platform, menuCtrl, shareService) {
        this.platform = platform;
        this.menuCtrl = menuCtrl;
        this.shareService = shareService;
        this.rootPage = LoginPage;
        this.initializeApp();
        this.pages = [
            { title: 'Quest', component: QuestPage, icon_name: 'navigate' },
            { title: 'Map', component: MapPage, icon_name: 'compass' },
            { title: 'Stats', component: StatsPage, icon_name: 'stats' },
            { title: 'Create', component: CreatePage, icon_name: 'color-wand' },
            { title: 'Logout', component: LogoutPage, icon_name: 'exit' },
            { title: 'Question', component: QuestionPage, icon_name: 'help' }
        ];
    }
    MyApp.prototype.initializeApp = function () {
        this.platform.ready().then(function () {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            StatusBar.styleDefault();
            Splashscreen.hide();
        });
    };
    MyApp.prototype.openPage = function (page) {
        this.menuCtrl.close();
        this.nav.setRoot(page.component);
    };
    return MyApp;
}());
__decorate([
    ViewChild(Nav),
    __metadata("design:type", Nav)
], MyApp.prototype, "nav", void 0);
MyApp = __decorate([
    Component({
        templateUrl: 'app.html',
        providers: [QuestShareService]
    }),
    __metadata("design:paramtypes", [Platform,
        MenuController,
        QuestShareService])
], MyApp);
export { MyApp };
//# sourceMappingURL=app.component.js.map