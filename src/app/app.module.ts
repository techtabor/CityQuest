import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { QuestionProvider } from '../providers/QuestionProvider';
import { GeoLocationProvider } from '../providers/GeoLocationProvider';

import { MapPage } from '../pages/MapPage/MapPage';
import { StatsPage } from '../pages/StatsPage/StatsPage';
import { QuestPage } from '../pages/QuestPage/QuestPage';

import { QuestShareService } from '../services/QuestShareService';

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
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, QuestionProvider, QuestShareService, GeoLocationProvider]
})
export class AppModule {}
