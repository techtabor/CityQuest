import { Component } from '@angular/core';
import { ServerIpProvider } from '../../../providers/ServerIpProvider';
import { Quest } from '../../../models/Quest';
import { LoginProvider } from '../../../providers/LoginProvider';
import { Http, Headers, RequestOptions } from '@angular/http';
import { NavController, AlertController } from 'ionic-angular';
import { QuestPage } from '../../QuestPage/QuestPage';
import { TeamPage } from '../../TeamPage/TeamPage';

@Component({
  selector: 'FriendsTab',
	templateUrl: 'FriendsTab.html'
})
export class FriendsTab {
  myFriends: any;

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

  RemoveFriend(femail) {
    let head = {'Content-Type': 'text/plain'};
    let headers    = new Headers(head);
    let options    = new RequestOptions({headers: headers});

    this.http.post(`${this.serverIpProvider.getServerIp()}/RemoveFriend`, JSON.stringify({id_token: this.loginProvider.getToken(), id_token_type: this.loginProvider.getType(), friendEmail: femail}), options)
      .subscribe(res => {this.GetFriends()});
  }

  GetFriends() {
    let head       = {'Content-Type': 'text/plain'};
    let headers    = new Headers(head);
    let options    = new RequestOptions({headers: headers});

    this.http.post(`${this.serverIpProvider.getServerIp()}/GetFriends`, JSON.stringify({id_token: this.loginProvider.getToken(), id_token_type: this.loginProvider.getType()}), options)
            .subscribe(res => {this.myFriends = res.json().Friends});
  }

  ionViewDidLoad() {
    this.GetFriends();
  }
}
