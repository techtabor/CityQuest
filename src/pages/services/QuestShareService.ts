import { Quest } from '../../models/quest'
import { Question } from '../../models/question';

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
