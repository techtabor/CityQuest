import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';

import { Question } from '../../models/Question';
import { Quest } from '../../models/Quest';
import { QuestionProvider } from '../../providers/QuestionProvider';

import { QuestShareService } from '../../services/QuestShareService';

/*
  Generated class for the Quest page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/

@Component({
  selector: 'page-quest',
  templateUrl: 'QuestPage.html',
})
export class QuestPage {
  //currentQuestionID: number = 0;
  //currentQuestionCode: string = "00000000000000000000000000000000";
  currentQuestion: Question = new Question();
  quest: Quest = new Quest();

  questId: string;
  ans: string;

  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              private questionProvider: QuestionProvider,
              private shareService: QuestShareService)  { }

  loadQuest(id) {
    if (id != '') {
      console.log('Loading quest with id', id);
      this.questionProvider.loadQuestHeader(id).subscribe(
        questHeader => {
          if(questHeader.length) {
            this.quest.header = questHeader[0];
            this.questionProvider.loadQuestion(questHeader[0].Start, "00000000000000000000000000000000").subscribe(
              question => {
                this.currentQuestion = question;
                this.shareService.setQuest(this.quest);
                this.shareService.setCurrentQuestion(this.currentQuestion);
              }
            );
          }
        }
      );
      /*this.questionProvider.loadQuestions(id).subscribe(
        questions => {
          this.quest.questions = questions;

          if (questions[0] != undefined) {
            this.sortQuestions();

            this.currentQuestion = questions[0];

            this.shareService.setQuest(this.quest);
            this.shareService.setCurrentQuestion(this.currentQuestion);
          }
        }
      );*/
    }
  }

  /*sortQuestions() {
    let questId: string = this.quest.header.Start;

    for (let i = 0; i < this.quest.questions.length; ++i) {
      for (let j = 0; j < this.quest.questions.length; ++j) {
        if (this.quest.questions[j].Id == questId) {
          questId = this.quest.questions[j].Next;

          let tmp = this.quest.questions[i];
          this.quest.questions[i] = this.quest.questions[j];
          this.quest.questions[j] = tmp;
        }
      }
    }
  }*/

  /*nextQuestion() {
    this.currentQuestionIndex++;

    if (this.currentQuestionIndex < this.quest.questions.length) {
      this.currentQuestion = this.quest.questions[this.currentQuestionIndex];
    } else {
      this.currentQuestionIndex = 0;
      let alert = this.alertCtrl.create({
    		title: 'Congratulations',
    		subTitle: 'You have successfully completed this quest!',
    		buttons: ['OK']
    	});
    	alert.present();
    }

    this.shareService.setCurrentQuestion(this.currentQuestion);
  }*/

  ionViewDidLoad() {
    console.log('Hello QuestPage Page');

    if (this.shareService.getQuest() != undefined) {
      this.quest = this.shareService.getQuest();
      this.currentQuestion = this.shareService.getCurrentQuestion();
      this.questId = this.quest.header.Id;
    }
  }

  checkAnswer() {
    let title:string, subTitle:string;
  	let buttons:Array<string> = ['OK'];


    this.questionProvider.sendSolution(this.currentQuestion.Id, this.currentQuestion.HashID, this.ans).subscribe(
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

  	/*let title:string, subTitle:string;
  	let buttons:Array<string> = ['OK'];

    if (this.ans == this.currentQuestion.Answer) {
      title = 'Correct Answer';
      subTitle = 'Your answer was correct';
      this.nextQuestion();
    } else {
      title = 'Incorrect Answer';
      subTitle = 'Your answer was not correct!';
    }

  	let alert = this.alertCtrl.create({
  		title: title,
  		subTitle: subTitle,
  		buttons: buttons
  	});
  	alert.present();*/
  }
}
