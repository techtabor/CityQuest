import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';

import { QuestShareService } from '../services/QuestShareService';

declare var google;

/*
  Generated class for the Map page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;

  constructor(public navCtrl: NavController,
              private shareService: QuestShareService) { }

  ionViewDidLoad(){
    console.log('Hello MapPage page');
    this.loadMap();
  }

  loadMap(){
    console.log('Loading map');
    let latLng = new google.maps.LatLng(this.shareService.getCurrentQuestion().Latitude, this.shareService.getCurrentQuestion().Longitude);

    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    let marker = new google.maps.Marker({
      position: latLng,
      map: this.map,
      title: 'Current Question'
    });
  }

}
