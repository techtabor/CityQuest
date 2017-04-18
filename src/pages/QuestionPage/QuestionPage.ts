import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';

import { Quest } from '../../models/Quest';
import { Option } from '../../models/Option';
import { Question } from '../../models/Question';
import { QuestionProvider } from '../../providers/QuestionProvider';
import { LoginProvider } from '../../providers/LoginProvider';
import { QuestPage } from '../QuestPage/QuestPage';
import { TeamPage } from '../TeamPage/TeamPage';

import { QuestShareService } from '../../services/QuestShareService';

/*
  Generated class for the QuestionPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-question-page',
  templateUrl: 'QuestionPage.html'
})
export class QuestionPage {

  private currentQuestion:Question;

  constructor(
    public navCtrl: NavController,
    private shareService: QuestShareService,
    private alertCtrl: AlertController,
    private loginProvider: LoginProvider,
    private questionProvider: QuestionProvider
  ) { }

  ionViewDidLoad() {
  	this.currentQuestion = this.shareService.getCurrentQuestion();
  }

  openProfile() {

  }
  openTeam() {
    this.navCtrl.setRoot(TeamPage);
  }


  checkAnswer(o:Option) {
    let title:string, subTitle:string;
    let buttons:Array<string> = ['OK'];


    this.questionProvider.sendSolution(this.currentQuestion.Id, this.currentQuestion.HashID, o.Value.toString()).subscribe(
      solutionRes => {
        if(solutionRes.Correct) {
          if(solutionRes.NextId == "0") {
            title = 'You win!';
            subTitle = 'Congratulations, you have won.';
            let alert = this.alertCtrl.create({
              title: title,
              subTitle: subTitle,
              buttons: buttons
            });
            alert.present();
            this.navCtrl.setRoot(QuestPage);
          } else {
            this.currentQuestion.Id = solutionRes.NextId;
            this.currentQuestion.HashID = solutionRes.NextCode;
            this.questionProvider.loadQuestion(this.currentQuestion.Id, this.currentQuestion.HashID).subscribe(
              question => {
                this.currentQuestion = question;
              }
            );
          }
        } else {
          title = 'Incorrect Answer';
          subTitle = solutionRes.Response;
          let alert = this.alertCtrl.create({
            title: title,
            subTitle: subTitle,
            buttons: buttons
          });
          alert.present();
        }
      }
    )
  }
}
