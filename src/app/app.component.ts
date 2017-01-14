import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, Nav  } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { MapPage } from '../pages/MapPage/MapPage';
import { StatsPage } from '../pages/StatsPage/StatsPage';
import { QuestPage } from '../pages/QuestPage/QuestPage';
import { CreatePage } from '../pages/CreatePage/CreatePage';

import { QuestShareService } from '../services/QuestShareService';

@Component({
  templateUrl: 'app.html',
  providers: [QuestShareService]
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = QuestPage;
  pages: Array<{title: string, component: any, icon_name: string}>;

  constructor(
    public platform: Platform,
    public menuCtrl: MenuController,
    private shareService: QuestShareService
  ) {
    this.initializeApp();

    this.pages = [
      {title: 'Quest', component: QuestPage, icon_name: 'navigate'},
      {title: 'Map', component: MapPage, icon_name: 'compass'},
      {title: 'Stats', component: StatsPage, icon_name: 'stats'},
      {title: 'Create', component: CreatePage, icon_name: 'color-wand'}
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
