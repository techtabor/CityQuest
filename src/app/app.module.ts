import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { QuestionProvider } from '../providers/QuestionProvider';

import { MapPage } from '../pages/map/map';
import { StatsPage } from '../pages/stats/stats';
import { QuestPage } from '../pages/quest/quest';

@NgModule({
  declarations: [
    MyApp,
    MapPage,
    StatsPage,
    QuestPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    MapPage,
    StatsPage,
    QuestPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, QuestionProvider]
})
export class AppModule {}
