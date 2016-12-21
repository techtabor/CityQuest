import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { CreateQuestionComponent } from './CreateQuestionComponent';
import { Question } from '../../models/Question';

declare var google;

/*
  Generated class for the CreatePage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-create',
  templateUrl: 'CreatePage.html'
})
export class CreatePage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  markers: any[] = Array<any>();
  questions: Question[] = Array<Question>();

  constructor(public navCtrl: NavController,
  			  public navParams: NavParams) {}

  loadMap() {
  	console.log('Loading map');
    let latLng = new google.maps.LatLng(47.48, 19.07);

    let mapOptions = {
      center: latLng,
      zoom: 13,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    this.map.addListener('click', function(e) {
      let q: Question = new Question();
      q.Latitude  = e.latLng.lat();
      q.Longitude = e.latLng.lng();

      this.questions.push(q);

      let marker = new google.maps.Marker({
        position: e.latLng,
        map: this.map,
        clickable: true
   	  });

      marker.addListener('click', function (ev) {
      	
      });

   	  this.markers.push(marker);
      this.map.panTo(e.latLng);
    }.bind(this));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreatePage');

    this.loadMap();
  }

  onClick() {
  	console.log("Map clicked!"); // I don't know why it works, but it does. Don't remove this line, because otherwise the list below the map won't update.
  }
}
