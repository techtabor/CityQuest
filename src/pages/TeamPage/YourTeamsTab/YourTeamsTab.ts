import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { GeoLocationProvider } from '../../../providers/GeoLocationProvider';
import { LoginProvider } from '../../../providers/LoginProvider';
import { QuestShareService } from '../../../services/QuestShareService';
import { TeamShareService } from '../../../services/TeamShareService';
import { ServerIpProvider } from '../../../providers/ServerIpProvider';
import { QuestionProvider } from '../../../providers/QuestionProvider';
import { TeamPage } from '../TeamPage';
//import { QuestionTab } from '../QuestionPage/QuestionTab/QuestionTab';
import { Question } from '../../models/Question';
import { Quest } from '../../models/Quest';
import { QuestHeader } from '../../models/QuestHeader';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { QuestPage } from '../../QuestPage/QuestPage';

import { ListTeamTab } from '../ListTeamTab/ListTeamTab';

@Component({
  selector: 'YourTeamsTab',
	templateUrl: 'YourTeamsTab.html'
})
export class YourTeamsTab {
  myTeams: any;
  myTeamMembers: any;
  newName: string;
  addedEmail: string;
  newMembers: any;
  selectedPage: number;
  selectedTeam: any;
  constructor(
    public http: Http,
    public navCtrl: NavController,
    public geoLocationProvider: GeoLocationProvider,
    public alertCtrl: AlertController,
    public shareService: QuestShareService,
    public teamShareService: TeamShareService,
    public questionProvider: QuestionProvider,
    public loginProvider: LoginProvider,
    public serverIpProvider: ServerIpProvider
) {
    this.myTeams = [];
    this.myTeamMembers = [];
    this.newMembers = [];
    this.newName = "";
    this.selectedPage = 0;
  }

  openProfile() {
    this.navCtrl.setRoot(QuestPage);
  }
  openTeams() {
    this.navCtrl.setRoot(TeamPage);
  }

  AddMember() {
    var mem = {email: ""};
    this.newMembers.push(mem);
  }

  AddExistingMember() {
    let head = {'Content-Type': 'text/plain'};
    let headers    = new Headers(head);
    let options    = new RequestOptions({headers: headers});
    this.http.post(`${this.serverIpProvider.getServerIp()}/AddTeamMembers`, JSON.stringify({id_token: this.loginProvider.getToken(), id_token_type: this.loginProvider.getType(), team: this.selectedTeam.Team, email: this.addedEmail}), options)
            .subscribe(res => {
              var ress = res.json();
              var alert;
              if(ress.Ok == 0) {
                alert = this.alertCtrl.create({
                  title: 'Ok',
                  subTitle: 'If there is a user on that email, they have been successfully!',
                  buttons: ['OK']
                });
              } else {
                alert = this.alertCtrl.create({
                  title: 'Error',
                  subTitle: 'There was an error with the team!\n' + ress.Message,
                  buttons: ['OK']
                });
              }
              alert.present();
              this.ViewMembers(this.selectedTeam);
              this.GetTeams();
            });
  }

  RemoveExistingMember(memail) {
    /*let head = {'Content-Type': 'text/plain'};
    let headers    = new Headers(head);
    let options    = new RequestOptions({headers: headers});
    this.http.post(`${this.serverIpProvider.getServerIp()}/AddTeamMembers`, JSON.stringify({id_token: this.loginProvider.getToken(), id_token_type: this.loginProvider.getType(), team: this.selectedTeam.Team, email: this.addedEmail}), options)
            .subscribe(res => {
              var ress = res.json();
              var alert;
              if(ress.Ok == 0) {
                alert = this.alertCtrl.create({
                  title: 'Ok',
                  subTitle: 'Member removed successfully!',
                  buttons: ['OK']
                });
              } else {
                alert = this.alertCtrl.create({
                  title: 'Error',
                  subTitle: 'There was an error with the team!\n' + ress.Message,
                  buttons: ['OK']
                });
              }
              alert.present();
              this.ViewMembers(this.selectedTeam);
              this.GetTeams();
            });*/
    var alert;
    alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: 'Feature not implemented!',
      buttons: ['OK']
    });
    alert.present();
  }

  DeleteMember(mem) {
    let ind:number = this.newMembers.indexOf(mem);
    this.newMembers.splice(ind,1);
  }

  Submit() {
    let head = {'Content-Type': 'text/plain'};
    let headers    = new Headers(head);
    let options    = new RequestOptions({headers: headers});
    this.http.post(`${this.serverIpProvider.getServerIp()}/CreateTeam`, JSON.stringify({id_token: this.loginProvider.getToken(), id_token_type: this.loginProvider.getType(), name: this.newName, members: this.newMembers}), options)
            .subscribe(res => {
              var ress = res.json();
              var alert;
              if(ress.Ok == 0) {
                alert = this.alertCtrl.create({
                  title: 'Ok',
                  subTitle: 'Team created successfully!',
                  buttons: ['OK']
                });
              } else {
                alert = this.alertCtrl.create({
                  title: 'Error',
                  subTitle: 'There was an error with the team!\n' + ress.Message,
                  buttons: ['OK']
                });
              }
              alert.present();
              this.GetTeams();
            });
  }

  GetTeams() {
    let head = {'Content-Type': 'text/plain'};
    let headers    = new Headers(head);
    let options    = new RequestOptions({headers: headers});
    this.http.post(`${this.serverIpProvider.getServerIp()}/GetTeams`, JSON.stringify({id_token: this.loginProvider.getToken(), id_token_type: this.loginProvider.getType()}), options)
            .subscribe(res => {this.myTeams = res.json().Members});
  }

  ViewMembers(t) {
    this.teamShareService.setTeam(t);
    let head = {'Content-Type': 'text/plain'};
    let headers    = new Headers(head);
    let options    = new RequestOptions({headers: headers});
    this.http.post(`${this.serverIpProvider.getServerIp()}/GetTeamMembers`, JSON.stringify({id_token: this.loginProvider.getToken(), id_token_type: this.loginProvider.getType(), team: t.Team}), options)
            .subscribe(res => {
              console.log(this.teamShareService.getTeam());
              this.teamShareService.setTeamMembers(res.json().Members);
              this.navCtrl.parent.select(2);
            });
  }

  LeaveTeam() {
    let head = {'Content-Type': 'text/plain'};
    let headers    = new Headers(head);
    let options    = new RequestOptions({headers: headers});
    this.http.post(`${this.serverIpProvider.getServerIp()}/LeaveTeam`, JSON.stringify({id_token: this.loginProvider.getToken(), id_token_type: this.loginProvider.getType(), team: this.selectedTeam.Team}), options)
            .subscribe(res => {
              var resp = res.json();
              if(resp.Ok == 0) {
                this.GetTeams();
                this.selectedPage = 0;
              }
              else {
                var alert = this.alertCtrl.create({
                  title: 'Error',
                  subTitle: 'There was an error with the team!\n' + resp.Message,
                  buttons: ['OK']
                });
                alert.present();
              }
            });
  }

  ChooseTeam() {
    this.ChooseTeamId(this.selectedTeam.Team);
  }

  ChooseTeamId(id) {
    let head = {'Content-Type': 'text/plain'};
    let headers    = new Headers(head);
    let options    = new RequestOptions({headers: headers});
    this.http.post(`${this.serverIpProvider.getServerIp()}/SetTeam`, JSON.stringify({id_token: this.loginProvider.getToken(), id_token_type: this.loginProvider.getType(), team: id}), options)
            .subscribe(res => {
              var resp = res.json();
              if(resp.Ok == 0) {
                this.loginProvider.teamName = resp.TeamName;
                this.loginProvider.team = id;
              }
              else {
                var alert = this.alertCtrl.create({
                  title: 'Error',
                  subTitle: 'Login error!',
                  buttons: ['OK']
                });
                alert.present();
              }
            });
  }

  ionViewDidLoad() {
    this.GetTeams();
    console.log('Hello YourTeamsTab Page');
  }
}
