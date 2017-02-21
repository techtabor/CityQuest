var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule, ErrorHandler } from '@angular/core';
//import { GoogleAuth, User } from '@ionic/cloud-angular';
//import { CloudSettings, CloudModule } from '@ionic/cloud-angular';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { QuestionProvider } from '../providers/QuestionProvider';
import { GeoLocationProvider } from '../providers/GeoLocationProvider';
import { LoginProvider } from '../providers/LoginProvider';
import { ServerIpProvider } from '../providers/ServerIpProvider';
import { MapPage } from '../pages/MapPage/MapPage';
import { StatsPage } from '../pages/StatsPage/StatsPage';
import { QuestPage } from '../pages/QuestPage/QuestPage';
import { LoginPage } from '../pages/LoginPage/LoginPage';
import { LogoutPage } from '../pages/LogoutPage/LogoutPage';
import { CreatePage } from '../pages/CreatePage/CreatePage';
import { QuestionPage } from '../pages/QuestionPage/QuestionPage';
import { QuestShareService } from '../services/QuestShareService';
/*const cloudSettings: CloudSettings = {
  'core': {
    'app_id': '1525269b'
  },
  'auth': {
    'google': {
      'webClientId': '316471932564-lua2b3k1dih7ta9ommf9tumimupe03bc.apps.googleusercontent.com',
      'scope': []
    }
  }
};
*/
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    NgModule({
        declarations: [
            MyApp,
            MapPage,
            StatsPage,
            QuestPage,
            LoginPage,
            LogoutPage,
            CreatePage,
            QuestionPage
        ],
        imports: [
            IonicModule.forRoot(MyApp),
        ],
        bootstrap: [IonicApp],
        entryComponents: [
            MyApp,
            MapPage,
            StatsPage,
            QuestPage,
            LoginPage,
            LogoutPage,
            CreatePage,
            QuestionPage
        ],
        providers: [{ provide: ErrorHandler, useClass: IonicErrorHandler }, QuestionProvider, QuestShareService, GeoLocationProvider, LoginProvider, ServerIpProvider]
    })
], AppModule);
export { AppModule };
//# sourceMappingURL=app.module.js.map