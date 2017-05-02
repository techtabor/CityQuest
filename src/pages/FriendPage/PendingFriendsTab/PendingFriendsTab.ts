import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { ServerIpProvider } from '../../../providers/ServerIpProvider';
import { Quest } from '../../../models/Quest';
import { QuestHeader } from '../../../models/QuestHeader';
import { LoginProvider } from '../../../providers/LoginProvider';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

@Component({
	selector: 'PendingFriendsTab',
	templateUrl: 'PendingFriendsTab.html'
})
export class PendingFriendsTab {
	myPendings: any;

	constructor(
			public http: Http,
		  public alertCtrl: AlertController,
  		public serverIpProvider: ServerIpProvider,
  		public loginProvider: LoginProvider) {

	}

	ConfirmRequest(femail, accept) {
		let head = {'Content-Type': 'text/plain'};
		let headers    = new Headers(head);
		let options    = new RequestOptions({headers: headers});

		this.http.post(`${this.serverIpProvider.getServerIp()}/ConfirmRequest`, JSON.stringify({id_token: this.loginProvider.getToken(), id_token_type: this.loginProvider.getType(), friendemail: femail, accepted: accept}), options)
            .subscribe(res => {
              var resp = res.json();
              if(resp.Ok == 0) {
								if(accept == false) {
	                var alert = this.alertCtrl.create({
	                  title: 'Request denied',
	                  subTitle: 'If this user is bothering you, you should report them to CityQuest support.',
	                  buttons: ['OK']
	                });
	                alert.present();
								}
              } else {
                var alert = this.alertCtrl.create({
                  title: 'Error',
                  subTitle: 'Unexpected error!',
                  buttons: ['OK']
                });
                alert.present();
              }
							this.GetFriends();
            });
	}

	GetFriends() {
		let head = {'Content-Type': 'text/plain'};
		let headers    = new Headers(head);
		let options    = new RequestOptions({headers: headers});
		console.log("Getting stats");
		this.http.post(`${this.serverIpProvider.getServerIp()}/GetFriendRequests`, JSON.stringify({id_token: this.loginProvider.getToken(), id_token_type: this.loginProvider.getType()}), options)
						.subscribe(res => {
							this.myPendings = res.json().Friends
						});
	}

	ionViewDidLoad(){
		this.GetFriends();
	}
}
