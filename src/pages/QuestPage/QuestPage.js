var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { Question } from '../../models/Question';
import { Quest } from '../../models/Quest';
import { QuestionProvider } from '../../providers/QuestionProvider';
import { QuestionPage } from '../QuestionPage/QuestionPage';
import { QuestShareService } from '../../services/QuestShareService';
/*
  Generated class for the Quest page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
var QuestPage = (function () {
    function QuestPage(navCtrl, alertCtrl, questionProvider, shareService) {
        this.navCtrl = navCtrl;
        this.alertCtrl = alertCtrl;
        this.questionProvider = questionProvider;
        this.shareService = shareService;
        //currentQuestionID: number = 0;
        //currentQuestionCode: string = "00000000000000000000000000000000";
        this.currentQuestion = new Question();
        this.quest = new Quest();
        this.availableQuests = new Array();
    }
    QuestPage.prototype.loadQuest = function (id) {
        var _this = this;
        if (id != '') {
            console.log('Loading quest with id', id);
            this.questionProvider.loadQuestHeader(id).subscribe(function (questHeader) {
                if (questHeader.length) {
                    _this.quest.header = questHeader[0];
                    _this.questionProvider.loadQuestion(questHeader[0].Start, "00000000000000000000000000000000").subscribe(function (question) {
                        _this.currentQuestion = question;
                        _this.shareService.setQuest(_this.quest);
                        _this.shareService.setCurrentQuestion(_this.currentQuestion);
                        _this.navCtrl.setRoot(QuestionPage);
                        console.log('Our current question: ' + _this.currentQuestion.Question);
                    });
                }
            });
        }
    };
    QuestPage.prototype.openQuest = function (q) {
        this.loadQuest(q.header.Id);
    };
    QuestPage.prototype.getSuggestions = function () {
        var _this = this;
        this.questionProvider.loadSuggestions().subscribe(function (suggestions) {
            for (var i = 0; i < suggestions.length; ++i) {
                _this.availableQuests[i] = new Quest();
                _this.availableQuests[i].header = suggestions[i];
            }
        });
    };
    QuestPage.prototype.ionViewDidLoad = function () {
        console.log('Hello QuestPage Page');
        this.getSuggestions();
        if (this.shareService.getQuest() != undefined) {
            this.quest = this.shareService.getQuest();
            this.currentQuestion = this.shareService.getCurrentQuestion();
            this.questId = this.quest.header.Id;
        }
    };
    QuestPage.prototype.checkAnswer = function () {
        var _this = this;
        var title, subTitle;
        var buttons = ['OK'];
        this.questionProvider.sendSolution(this.currentQuestion.Id, this.currentQuestion.HashID, this.ans).subscribe(function (solutionRes) {
            if (solutionRes.Correct) {
                if (solutionRes.NextId == "0") {
                    title = 'You win!';
                    subTitle = 'Congratulations, you have won.';
                    var alert_1 = _this.alertCtrl.create({
                        title: title,
                        subTitle: subTitle,
                        buttons: buttons
                    });
                    alert_1.present();
                }
                else {
                    _this.currentQuestion.Id = solutionRes.NextId;
                    _this.currentQuestion.HashID = solutionRes.NextCode;
                    _this.questionProvider.loadQuestion(_this.currentQuestion.Id, _this.currentQuestion.HashID).subscribe(function (question) {
                        _this.currentQuestion = question;
                    });
                }
            }
            else {
                title = 'Incorrect Answer';
                subTitle = solutionRes.Response;
                var alert_2 = _this.alertCtrl.create({
                    title: title,
                    subTitle: subTitle,
                    buttons: buttons
                });
                alert_2.present();
            }
        });
    };
    return QuestPage;
}());
QuestPage = __decorate([
    Component({
        selector: 'page-quest',
        templateUrl: 'QuestPage.html',
    }),
    __metadata("design:paramtypes", [NavController,
        AlertController,
        QuestionProvider,
        QuestShareService])
], QuestPage);
export { QuestPage };
//# sourceMappingURL=QuestPage.js.map