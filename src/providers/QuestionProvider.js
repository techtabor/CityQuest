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
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { GeoLocationProvider } from '../providers/GeoLocationProvider';
import { LoginProvider } from '../providers/LoginProvider';
import { ServerIpProvider } from '../providers/ServerIpProvider';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
/*
  Generated class for the QuestionProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
var QuestionProvider = (function () {
    function QuestionProvider(http, geoLocationProvider, loginProvider, serverIpProvider) {
        this.http = http;
        this.geoLocationProvider = geoLocationProvider;
        this.loginProvider = loginProvider;
        this.serverIpProvider = serverIpProvider;
        console.log('Hello QuestionProvider Provider');
    }
    QuestionProvider.prototype.loadQuestion = function (questionId, questionCode) {
        var head = { 'Content-Type': 'text/plain' };
        var headers = new Headers(head);
        var options = new RequestOptions({ headers: headers });
        return this.http.post(this.serverIpProvider.getServerIp() + "/GetOneQuestion", JSON.stringify({ id_token: this.loginProvider.getToken(), id_token_type: this.loginProvider.getType(), Id: questionId, Code: questionCode }), options)
            .map(function (res) { return res.json(); });
    };
    QuestionProvider.prototype.sendSolution = function (questionId, questionCode, solution) {
        var head = { 'Content-Type': 'text/plain' };
        var headers = new Headers(head);
        var options = new RequestOptions({ headers: headers });
        var geoData = this.geoLocationProvider.getLocation();
        return this.http.post(this.serverIpProvider.getServerIp() + "/SubmitQuestionSolution", JSON.stringify({ id_token: this.loginProvider.getToken(), id_token_type: this.loginProvider.getType(), Id: questionId, Code: questionCode, Sol: solution, Lat: geoData.latitude, Long: geoData.longitude }), options)
            .map(function (res) { return res.json(); });
    };
    QuestionProvider.prototype.loadQuestHeader = function (questId) {
        var head = { 'Content-Type': 'text/plain' };
        var headers = new Headers(head);
        var options = new RequestOptions({ headers: headers });
        return this.http.post(this.serverIpProvider.getServerIp() + "/GetQuestHeader", { id_token: this.loginProvider.getToken(), id_token_type: this.loginProvider.getType(), Id: questId }, options)
            .map(function (res) { return res.json(); });
    };
    QuestionProvider.prototype.loadSuggestions = function () {
        var head = { 'Content-Type': 'text/plain' };
        var headers = new Headers(head);
        var options = new RequestOptions({ headers: headers });
        return this.http.post(this.serverIpProvider.getServerIp() + "/GetSuggestions", { id_token: this.loginProvider.getToken(), id_token_type: this.loginProvider.getType() }, options)
            .map(function (res) { return res.json(); });
    };
    QuestionProvider.prototype.loadQuestions = function (questId) {
        var head = { 'Content-Type': 'text/plain' };
        var headers = new Headers(head);
        var options = new RequestOptions({ headers: headers });
        return this.http.post(this.serverIpProvider.getServerIp() + "/GetAllQuestions", { id_token: this.loginProvider.getToken(), id_token_type: this.loginProvider.getType(), Id: questId }, options)
            .map(function (res) { return res.json(); });
    };
    QuestionProvider.prototype.createQuest = function (quest) {
        var head = { 'Content-Type': 'text/plain' };
        var headers = new Headers(head);
        var options = new RequestOptions({ headers: headers });
        return this.http.post(this.serverIpProvider.getServerIp() + "/Create", { id_token: this.loginProvider.getToken(), id_token_type: this.loginProvider.getType(), CreateData: quest }, options)
            .map(function (res) { return JSON.stringify(res); });
    };
    QuestionProvider.prototype.handleError = function (error) {
        // In a real world app, we might use a remote logging infrastructure
        var errMsg;
        if (error instanceof Response) {
            var body = error.json() || '';
            var err = body.error || JSON.stringify(body);
            errMsg = error.status + " - " + (error.statusText || '') + " " + err;
        }
        else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    };
    return QuestionProvider;
}());
QuestionProvider = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Http,
        GeoLocationProvider,
        LoginProvider,
        ServerIpProvider])
], QuestionProvider);
export { QuestionProvider };
//# sourceMappingURL=QuestionProvider.js.map