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

import { GlobalStatsTab } from '../pages/StatsPage/GlobalStatsTab/GlobalStatsTab';
import { FriendStatsTab } from '../pages/StatsPage/FriendStatsTab/FriendStatsTab';
import { PlayerStatsTab } from '../pages/StatsPage/PlayerStatsTab/PlayerStatsTab';

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
@NgModule({
  declarations: [
    MyApp,
    MapPage,
    StatsPage,
    QuestPage,
    LoginPage,
    LogoutPage,
    CreatePage,
    QuestionPage,
    GlobalStatsTab,
    PlayerStatsTab,
    FriendStatsTab
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    //CloudModule.forRoot(cloudSettings)
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
    QuestionPage,
    GlobalStatsTab,
    PlayerStatsTab,
    FriendStatsTab
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, QuestionProvider, QuestShareService, GeoLocationProvider, LoginProvider, ServerIpProvider]
})
export class AppModule {}
