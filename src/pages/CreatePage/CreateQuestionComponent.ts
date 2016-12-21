import { Component } from '@angular/core';
import { Question } from '../../models/Question';

@Component({
  selector: 'create-question',
  template: `<ion-row>
  			   <ion-col width-50>
  			     <ion-input placeholder="Question">
  			     </ion-input>
  			   </ion-col>
  			   <ion-col width-30>
  			     <ion-input placeholder="Answer">
  			     </ion-input>
  			   </ion-col>
  			   <ion-col width-20>
                 <button ion-fab>
                 	<ion-icon name="trash"></ion-icon>
                 </button>
  			   </ion-col>
  			 </ion-row>`
})
export class CreateQuestionComponent {
  question: Question;

  description: string;
  answer: string;
}