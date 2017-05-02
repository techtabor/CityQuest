import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { GeoLocationProvider } from '../../providers/GeoLocationProvider';
import { LoginProvider } from '../../providers/LoginProvider';
import { QuestShareService } from '../../services/QuestShareService';
import { ServerIpProvider } from '../../providers/ServerIpProvider';
import { QuestionProvider } from '../../providers/QuestionProvider';
import { QuestionPage } from '../QuestionPage/QuestionPage';
import { Question } from '../../models/Question';
import { Quest } from '../../models/Quest';
import { QuestHeader } from '../../models/QuestHeader';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { AddFriendsTab } from './AddFriendsTab/AddFriendsTab';
import { FriendsTab } from './FriendsTab/FriendsTab';
import { PendingFriendsTab } from './PendingFriendsTab/PendingFriendsTab';


/*
  Generated class for the Stats page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-friends',
  templateUrl: 'FriendPage.html'
})
export class FriendPage {
  geo: GeoLocationProvider;
  addFriendsTab: any;
  friendsTab: any;
  pendingFriendsTab: any;

  constructor(
    public http: Http,
    public navCtrl: NavController,
    public loginProvider: LoginProvider,
    public shareService: QuestShareService,
    public questionProvider: QuestionProvider,
    public serverIpProvider: ServerIpProvider
  ) {
	this.addFriendsTab = AddFriendsTab;
	this.friendsTab = FriendsTab;
  this.pendingFriendsTab = PendingFriendsTab;
  }

  ionViewDidLoad() {
    console.log('Hello StatsPage Page');
  }
}
