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
  currentQuestionIndex: number = 0;
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
        questHeader => this.quest.header = questHeader[0]
      );
      this.questionProvider.loadQuestions(id).subscribe(
        questions => {
          this.quest.questions = questions;

          this.sortQuestions();

          if (questions[0] != undefined)
            this.currentQuestion = questions[0];

          this.shareService.setQuest(this.quest);
          this.shareService.setCurrentQuestion(this.currentQuestion);
        }
      );
    }
  }

  sortQuestions() {
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
  }

  nextQuestion() {
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
  }

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
  	alert.present();
  }
}
