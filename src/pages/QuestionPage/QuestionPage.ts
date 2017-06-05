import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';

import { Question } from '../../models/Question';
import { Quest } from '../../models/Quest';
import { QuestHeader } from '../../models/QuestHeader';
import { QuestionProvider } from '../../providers/QuestionProvider';
import { LoginProvider } from '../../providers/LoginProvider';
import { TeamPage } from '../TeamPage/TeamPage';

import { QuestionTab } from './QuestionTab/QuestionTab';
import { MapTab } from './MapTab/MapTab';

import { QuestShareService } from '../../services/QuestShareService';

/*
  Generated class for the Quest page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/

@Component({
  selector: 'page-question',
  templateUrl: 'QuestionPage.html',
})
export class QuestionPage {
  questionTab: any;
  mapTab: any;
  constructor() {
    this.questionTab = QuestionTab;
    this.mapTab = MapTab;
  }

  reloadQuestions() {
    this.mapTab.loadMap();
  }

  ionViewDidLoad() {
    this.reloadQuestions();
  }
}
