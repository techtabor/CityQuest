import { Component, ViewChild } from '@angular/core';
//import { GoogleAuth, User } from '@ionic/cloud-angular';
import { Platform, MenuController, Nav  } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { StatsPage } from '../pages/StatsPage/StatsPage';
import { QuestPage } from '../pages/QuestPage/QuestPage';
import { LoginPage } from '../pages/LoginPage/LoginPage';
import { LogoutPage } from '../pages/LogoutPage/LogoutPage';
import { CreatePage } from '../pages/CreatePage/CreatePage';
import { TeamPage } from '../pages/TeamPage/TeamPage';
import { FriendPage } from '../pages/FriendPage/FriendPage';

import { QuestShareService } from '../services/QuestShareService';

@Component({
  templateUrl: 'app.html',
  providers: [QuestShareService]
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;
  pages: Array<{title: string, component: any, icon_name: string}>;

  constructor(
    public platform: Platform,
    public menuCtrl: MenuController,
    private shareService: QuestShareService
  ) {
    this.initializeApp();

    this.pages = [
      {title: 'Quest', component: QuestPage, icon_name: 'navigate'},
      {title: 'Stats', component: StatsPage, icon_name: 'stats'},
      {title: 'Team', component: TeamPage, icon_name: 'people'},
      {title: 'Friends', component: FriendPage, icon_name: 'contacts'},
      {title: 'Create', component: CreatePage, icon_name: 'color-wand'},
      {title: 'Logout', component: LogoutPage, icon_name: 'exit'}
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }

  openPage(page) {
    this.menuCtrl.close();
    this.nav.setRoot(page.component);
  }
}
