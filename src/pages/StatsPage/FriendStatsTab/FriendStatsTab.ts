import { Component } from '@angular/core';
import { ServerIpProvider } from '../../../providers/ServerIpProvider';
import { Quest } from '../../../models/Quest';
import { QuestHeader } from '../../../models/QuestHeader';
import { LoginProvider } from '../../../providers/LoginProvider';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { NavController, AlertController } from 'ionic-angular';
import { QuestPage } from '../../QuestPage/QuestPage';
import { TeamPage } from '../../TeamPage/TeamPage';

@Component({
  selector: 'FriendStatsTab',
	templateUrl: 'FriendStatsTab.html'
})
export class FriendStatsTab {
  myFriendStats: any;

  constructor(
  	public http: Http,
  	public serverIpProvider: ServerIpProvider,
    public navCtrl: NavController,
  	public loginProvider: LoginProvider) {

  }

  openProfile() {
    this.navCtrl.setRoot(QuestPage);
  }
  openTeams() {
    this.navCtrl.setRoot(TeamPage);
  }

  GetFriendStats() {
    let head = {'Content-Type': 'text/plain'};
    let headers    = new Headers(head);
    let options    = new RequestOptions({headers: headers});
    console.log("Getting stats");
    this.http.post(`${this.serverIpProvider.getServerIp()}/GetFriendStats`, JSON.stringify({id_token: this.loginProvider.getToken(), id_token_type: this.loginProvider.getType()}), options)
            .subscribe(res => {this.myFriendStats = res.json()});
  }

  ionViewDidLoad() {
  	this.GetFriendStats();
  }
}
