import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Question } from '../models/Question';
import { Solution } from '../models/Solution';
import { QuestHeader } from '../models/QuestHeader';
import { GeoLocationProvider } from '../providers/GeoLocationProvider';
import { LoginProvider } from '../providers/LoginProvider';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

/*
  Generated class for the QuestionProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class QuestionProvider {

  private serverUrl: string = 'http://localhost:2017';

  constructor(private http: Http, private geoLocationProvider: GeoLocationProvider, private loginProvider: LoginProvider) {

    console.log('Hello QuestionProvider Provider');
  }

  loadQuestion(questionId, questionCode: string): Observable<Question> {
    let head = {'Content-Type': 'text/plain'};

    let headers    = new Headers(head);
    let options    = new RequestOptions({headers: headers});


    return this.http.post(`${this.serverUrl}/Question`, JSON.stringify({id_token: this.loginProvider.getToken(), id_token_type: this.loginProvider.getType(), Id: questionId, Code: questionCode}), options)
            .map(res => <Question>res.json());
  }

  sendSolution(questionId, questionCode, solution: string): Observable<Solution> {
    let head = {'Content-Type': 'text/plain'};

    let headers    = new Headers(head);
    let options    = new RequestOptions({headers: headers});
    let geoData    = this.geoLocationProvider.getLocation();
    return this.http.post(`${this.serverUrl}/Solution`, JSON.stringify({id_token: this.loginProvider.getToken(), id_token_type: this.loginProvider.getType(), Id: questionId, Code: questionCode, Sol: solution, Lat: geoData.latitude, Long: geoData.longitude}), options)
    .map(res => <Solution>res.json());
  }

  loadQuestHeader(questId: number): Observable<QuestHeader[]> {
    let head = {'Content-Type': 'text/plain'};

    let headers    = new Headers(head);
    let options    = new RequestOptions({headers: headers});

    return this.http.post(`${this.serverUrl}/QuestHeader`, {id_token: this.loginProvider.getToken(), id_token_type: this.loginProvider.getType(), Id: questId}, options)
            .map(res => <QuestHeader[]>res.json());
  }

  loadQuestions(questId: number): Observable<Question[]> {
    let head = {'Content-Type': 'text/plain'};

    let headers    = new Headers(head);
    let options    = new RequestOptions({headers: headers});

    return this.http.post(`${this.serverUrl}/Questions`, {id_token: this.loginProvider.getToken(), id_token_type: this.loginProvider.getType(), Id: questId}, options)
            .map(res => <Question[]>res.json());
  }

  private handleError (error: Response | any) {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

}
