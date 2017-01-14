import { Quest } from '../models/Quest'
import { Question } from '../models/Question';

import { Injectable } from '@angular/core';

@Injectable()
export class QuestShareService {
  quest: Quest;
  currentQuestion: Question;

  constructor() {}

  setQuest(quest) {
    this.quest = quest;
  }

  setCurrentQuestion(currQuestion) {
    this.currentQuestion = currQuestion;
  }

  getQuest(): Quest {
    return this.quest;
  }

  getCurrentQuestion(): Question {
    return this.currentQuestion;
  }
}
