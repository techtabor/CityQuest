import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';

import { Question } from '../../models/Question';
import { Quest } from '../../models/Quest';
import { QuestHeader } from '../../models/QuestHeader';
import { QuestionProvider } from '../../providers/QuestionProvider';
import { LoginProvider } from '../../providers/LoginProvider';
import { QuestionPage } from '../QuestionPage/QuestionPage';


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
  availableQuests: Quest[] = new Array<Quest>();

  questId: string;
  ans: string;

  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              private questionProvider: QuestionProvider,
              private loginProvider: LoginProvider,
              private shareService: QuestShareService) {
  }

  loadQuest(id) {
    ///Code copied to StatsPage openQuest. Change there too!!!!!
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
                this.navCtrl.setRoot(QuestionPage);
                console.log('Our current question: ' + this.currentQuestion.Question);
              }
            );
          }
        }
      );
    }
  }

  openQuest(q:Quest) {
    this.loadQuest(q.header.Id);
  }

  getSuggestions() {
    this.questionProvider.loadSuggestions().subscribe(
      suggestions => {
        for (let i = 0; i < suggestions.length; ++i) {
          this.availableQuests[i] = new Quest();
          this.availableQuests[i].header = suggestions[i];
        }
      }
    );
  }

  openProfile() {
    
  }

  ionViewDidLoad() {
    console.log('Hello QuestPage Page');
    this.getSuggestions();

    if (this.shareService.getQuest() != undefined) {
      this.quest = this.shareService.getQuest();
      this.currentQuestion = this.shareService.getCurrentQuestion();
      this.questId = this.quest.header.Id;
    }
  }
}
