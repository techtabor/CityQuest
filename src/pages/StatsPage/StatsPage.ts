import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { GeoLocationProvider } from '../../providers/GeoLocationProvider';
import { LoginProvider } from '../../providers/LoginProvider';
import { QuestShareService } from '../../services/QuestShareService';
import { ServerIpProvider } from '../../providers/ServerIpProvider';
import { QuestionProvider } from '../../providers/QuestionProvider';
import { QuestionTab } from '../QuestionPage/QuestionTab/QuestionTab';
import { Question } from '../../models/Question';
import { Quest } from '../../models/Quest';
import { QuestHeader } from '../../models/QuestHeader';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { GlobalStatsTab } from './GlobalStatsTab/GlobalStatsTab';
import { PlayerStatsTab } from './PlayerStatsTab/PlayerStatsTab';
import { FriendStatsTab } from './FriendStatsTab/FriendStatsTab';


/*
  Generated class for the Stats page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-stats',
  templateUrl: 'StatsPage.html'
})
export class StatsPage {
  geo: GeoLocationProvider;
  myPlayerStats: any;
  myGlobalStats: any;
  selectedPage: number;
  globalStatsTab: any;
  playerStatsTab: any;
  friendStatsTab: any;
  constructor(
    public http: Http,
    public navCtrl: NavController,
    public geoLocationProvider: GeoLocationProvider,
    public loginProvider: LoginProvider,
    public shareService: QuestShareService,
    public questionProvider: QuestionProvider,
    public serverIpProvider: ServerIpProvider
  ) {
	this.globalStatsTab = GlobalStatsTab;
	this.playerStatsTab = PlayerStatsTab;
  this.friendStatsTab = FriendStatsTab;
  this.geo = geoLocationProvider;
  }

  openQuest(id) {
    ///Code copied from QuestPage loadQuest. Change there too!!!!!
    var quest: Quest = new Quest();
    if (id != '') {
      console.log('Loading quest with id', id);
      this.questionProvider.loadQuestHeader(id).subscribe(
        questHeader => {
          if(questHeader.length) {
            quest.header = questHeader[0];
            this.questionProvider.loadQuestion(questHeader[0].Start, "00000000000000000000000000000000").subscribe(
              question => {
                this.shareService.setQuest(quest);
                this.shareService.setCurrentQuestion(question);
                this.navCtrl.setRoot(QuestionTab);
                console.log('Our current question: ' + question.Question);
              }
            );
          }
        }
      );
    }
  }

  GeoC() {
    if(document.getElementById("gdiv") != null && this.geo.getLocation() != null) {
      document.getElementById("gdiv").innerText = this.geo.getLocation().latitude + " " + this.geo.getLocation().longitude;
    }
  }

  ionViewDidLoad() {
    console.log('Hello StatsPage Page');
  }
}
