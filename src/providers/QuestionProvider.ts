import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Question } from '../models/Question';
import { QuestHeader } from '../models/QuestHeader';

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

  constructor(private http: Http) {
    console.log('Hello QuestionProvider Provider');
  }

  loadQuestHeader(questId: number): Observable<QuestHeader> {
    let head = {'Content-Type': 'text/plain'};

    let headers    = new Headers(head);
    let options    = new RequestOptions({headers: headers});

    return this.http.post(`${this.serverUrl}/QuestHeader`, questId, options)
            .map(res => <QuestHeader>res.json());
  }

  loadQuestions(questId: number): Observable<Question[]> {
    let head = {'Content-Type': 'text/plain'};

    let headers    = new Headers(head);
    let options    = new RequestOptions({headers: headers});

    return this.http.post(`${this.serverUrl}/Questions`, questId, options)
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
