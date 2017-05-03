import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';

import { Question } from '../../models/Question';
import { Quest } from '../../models/Quest';
import { QuestHeader } from '../../models/QuestHeader';
import { QuestionProvider } from '../../providers/QuestionProvider';
import { LoginProvider } from '../../providers/LoginProvider';
import { TeamPage } from '../TeamPage/TeamPage';

import { QuestTab } from './QuestTab/QuestTab';
import { QuestionTab } from './QuestionTab/QuestionTab';
import { MapTab } from './MapTab/MapTab';

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
  questTab: any;
  questionTab: any;
  mapTab: any;
  constructor() {
    this.questTab = QuestTab;
    this.questionTab = QuestionTab;
    this.mapTab = MapTab;
  }

  ionViewDidLoad() {

  }
}
