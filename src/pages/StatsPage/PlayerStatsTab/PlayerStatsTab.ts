import { Component } from '@angular/core';
import { ServerIpProvider } from '../../../providers/ServerIpProvider';
import { Quest } from '../../../models/Quest';
import { QuestHeader } from '../../../models/QuestHeader';
import { LoginProvider } from '../../../providers/LoginProvider';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { NavController, AlertController } from 'ionic-angular';
import { QuestPage } from '../../QuestPage/QuestPage';
import { QuestionTab } from '../../QuestionPage/QuestionTab/QuestionTab';
import { TeamPage } from '../../TeamPage/TeamPage';
import { QuestionProvider } from '../../../providers/QuestionProvider';
import { QuestShareService } from '../../../services/QuestShareService';

@Component({
	selector: 'PlayerStatsTab',
	templateUrl: 'PlayerStatsTab.html'
})
export class PlayerStatsTab {
	myPlayerStats: any;

	constructor(
		public http: Http,
  	public serverIpProvider: ServerIpProvider,
    public navCtrl: NavController,
  	public loginProvider: LoginProvider,
		public questionProvider: QuestionProvider,
		public shareService: QuestShareService) {

	}

	openProfile() {
		this.navCtrl.setRoot(QuestPage);
	}
	openTeams() {
		this.navCtrl.setRoot(TeamPage);
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

	GetPlayerStats() {
    	let head = {'Content-Type': 'text/plain'};
    	let headers    = new Headers(head);
    	let options    = new RequestOptions({headers: headers});
    	console.log("Getting stats");
    	this.http.post(`${this.serverIpProvider.getServerIp()}/GetPlayedStats`, JSON.stringify({id_token: this.loginProvider.getToken(), id_token_type: this.loginProvider.getType()}), options)
            .subscribe(res => {this.myPlayerStats = res.json()});
  	}

	ionViewDidLoad(){
		this.GetPlayerStats();
	}
}
