import { NgModule, ErrorHandler } from '@angular/core';
//import { GoogleAuth, User } from '@ionic/cloud-angular';
//import { CloudSettings, CloudModule } from '@ionic/cloud-angular';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { QuestionProvider } from '../providers/QuestionProvider';
import { GeoLocationProvider } from '../providers/GeoLocationProvider';
import { LoginProvider } from '../providers/LoginProvider';
import { ServerIpProvider } from '../providers/ServerIpProvider';

import { StatsPage } from '../pages/StatsPage/StatsPage';
import { QuestPage } from '../pages/QuestPage/QuestPage';
import { QuestionPage } from '../pages/QuestionPage/QuestionPage';
import { LoginPage } from '../pages/LoginPage/LoginPage';
import { LogoutPage } from '../pages/LogoutPage/LogoutPage';
import { CreatePage } from '../pages/CreatePage/CreatePage';
import { TeamPage } from '../pages/TeamPage/TeamPage';
import { FriendPage } from '../pages/FriendPage/FriendPage';

import { GlobalStatsTab } from '../pages/StatsPage/GlobalStatsTab/GlobalStatsTab';
import { FriendStatsTab } from '../pages/StatsPage/FriendStatsTab/FriendStatsTab';
import { PlayerStatsTab } from '../pages/StatsPage/PlayerStatsTab/PlayerStatsTab';

import { AddFriendsTab } from '../pages/FriendPage/AddFriendsTab/AddFriendsTab';
import { FriendsTab } from '../pages/FriendPage/FriendsTab/FriendsTab';
import { PendingFriendsTab } from '../pages/FriendPage/PendingFriendsTab/PendingFriendsTab';


import { MapTab } from '../pages/QuestionPage/MapTab/MapTab';
import { QuestionTab } from '../pages/QuestionPage/QuestionTab/QuestionTab';

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
    StatsPage,
    QuestPage,
    MapTab,
    QuestionTab,
    QuestionPage,
    LoginPage,
    LogoutPage,
    CreatePage,
    TeamPage,
    GlobalStatsTab,
    PlayerStatsTab,
    FriendPage,
    FriendStatsTab,
    AddFriendsTab,
    FriendsTab,
    PendingFriendsTab
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    //CloudModule.forRoot(cloudSettings)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    StatsPage,
    QuestPage,
    MapTab,
    QuestionTab,
    QuestionPage,
    LoginPage,
    LogoutPage,
    CreatePage,
    TeamPage,
    FriendPage,
    GlobalStatsTab,
    PlayerStatsTab,
    FriendStatsTab,
    AddFriendsTab,
    FriendsTab,
    PendingFriendsTab
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, QuestionProvider, QuestShareService, GeoLocationProvider, LoginProvider, ServerIpProvider]
})
export class AppModule {}
