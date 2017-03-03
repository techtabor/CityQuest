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
  myStats: any;
  constructor(
    public http: Http,
    public navCtrl: NavController,
    public geoLocationProvider: GeoLocationProvider,
    public loginProvider: LoginProvider,
    public shareService: QuestShareService,
    public questionProvider: QuestionProvider,
    public serverIpProvider: ServerIpProvider
) {


    this.geo = geoLocationProvider;
    setInterval(
      (
        function(self) {         //Self-executing func which takes 'this' as self
         return function() {   //Return a function in the context of 'self'
           self.GeoC(); //Thing you wanted to run as non-window 'this'
         }
       }
     )(this),
    1000);

  }

  GetStats() {
    let head = {'Content-Type': 'text/plain'};
    let headers    = new Headers(head);
    let options    = new RequestOptions({headers: headers});
    console.log("Getting stats");
    this.http.post(`${this.serverIpProvider.getServerIp()}/GetPlayedQuests`, JSON.stringify({id_token: this.loginProvider.getToken(), id_token_type: this.loginProvider.getType()}), options)
            .subscribe(res => {this.myStats = res.json()});
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
                this.navCtrl.setRoot(QuestionPage);
                console.log('Our current question: ' + question.Question);
              }
            );
          }
        }
      );
    }
  }

  GeoC() {
    if(document.getElementById("gdiv") != null) {
      document.getElementById("gdiv").innerText = this.geo.getLocation().latitude + " " + this.geo.getLocation().longitude;
    }
  }

  ionViewDidLoad() {
    this.GetStats();
    console.log('Hello StatsPage Page');
}

}
