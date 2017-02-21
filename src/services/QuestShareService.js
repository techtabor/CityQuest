var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
var QuestShareService = (function () {
    function QuestShareService() {
    }
    QuestShareService.prototype.setQuest = function (quest) {
        this.quest = quest;
    };
    QuestShareService.prototype.setCurrentQuestion = function (currQuestion) {
        this.currentQuestion = currQuestion;
    };
    QuestShareService.prototype.getQuest = function () {
        return this.quest;
    };
    QuestShareService.prototype.getCurrentQuestion = function () {
        return this.currentQuestion;
    };
    return QuestShareService;
}());
QuestShareService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [])
], QuestShareService);
export { QuestShareService };
//# sourceMappingURL=QuestShareService.js.map