import { Component } from '@angular/core';
import { ServerIpProvider } from '../../../providers/ServerIpProvider';
import { Quest } from '../../../models/Quest';
import { QuestHeader } from '../../../models/QuestHeader';
import { LoginProvider } from '../../../providers/LoginProvider';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

@Component({
  selector: 'FriendStatsTab',
	templateUrl: 'FriendStatsTab.html'
})
export class FriendStatsTab {
  myFriendStats: any;

  constructor(
  	public http: Http,
  	public serverIpProvider: ServerIpProvider,
  	public loginProvider: LoginProvider) {

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