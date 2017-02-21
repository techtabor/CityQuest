import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Quest } from '../../models/Quest';
import { Question } from '../../models/Question';

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

  constructor(public navCtrl: NavController, private shareService: QuestShareService) { }

  ionViewDidLoad() {
  	this.currentQuestion = this.shareService.getCurrentQuestion();

    console.log(this.currentQuestion.Options);
  }

}
