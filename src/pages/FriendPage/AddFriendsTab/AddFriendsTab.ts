import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { ServerIpProvider } from '../../../providers/ServerIpProvider';
import { Quest } from '../../../models/Quest';
import { QuestHeader } from '../../../models/QuestHeader';
import { LoginProvider } from '../../../providers/LoginProvider';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

@Component({
  selector: 'AddFriendsTab',
	templateUrl: 'AddFriendsTab.html'
})
export class AddFriendsTab {
  friendEmail: any;

  constructor(
  	public http: Http,
  	public serverIpProvider: ServerIpProvider,
    public alertCtrl: AlertController,
  	public loginProvider: LoginProvider){

  }

  AddFriend() {
    let head = {'Content-Type': 'text/plain'};
    let headers    = new Headers(head);
    let options    = new RequestOptions({headers: headers});

    this.http.post(`${this.serverIpProvider.getServerIp()}/AddFriend`, JSON.stringify({id_token: this.loginProvider.getToken(), id_token_type: this.loginProvider.getType(), friendEmail: this.friendEmail}), options)
            .subscribe(res => {
              var resp = res.json();
              if(resp.Ok == 0) {
                var alert = this.alertCtrl.create({
                  title: 'Friend request sent',
                  subTitle: 'If there is a user with the given email address, a friend request has been sent to them.',
                  buttons: ['OK']
                });
                alert.present();
              } else {
                var alert = this.alertCtrl.create({
                  title: 'Error',
                  subTitle: 'Unexpected error!',
                  buttons: ['OK']
                });
                alert.present();
              }
            });
  }

  ionViewDidLoad() {

  }
}
