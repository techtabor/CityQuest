import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { CreateQuestionComponent } from './CreateQuestionComponent';
import { Quest } from '../../models/Quest';
import { Option } from '../../models/Option';
import { Question } from '../../models/Question';
import { QuestHeader } from '../../models/QuestHeader'
import { QuestionProvider } from '../../providers/QuestionProvider';
import { GeoLocationProvider } from '../../providers/GeoLocationProvider';

declare var google;

/*
  Generated class for the CreatePage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-create',
  templateUrl: 'CreatePage.html',
})
export class CreatePage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  name: string;
  description: string;
  markers: any[] = Array<any>();
  questions: Question[] = Array<Question>();

  constructor(public navCtrl: NavController,
  			      public navParams: NavParams,
              public alertCtrl: AlertController,
              public geoLocationProvider: GeoLocationProvider,
              private questionProvider: QuestionProvider) {}

  loadMap() {
  	console.log('Loading map');
    let latLng = new google.maps.LatLng(this.geoLocationProvider.getLocation().latitude, this.geoLocationProvider.getLocation().longitude);
    //let latLng = new google.maps.LatLng(46.15,19);
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
      q.Options = new Array<Option>();

      this.questions.push(q);

      let marker = new google.maps.Marker({
        position: e.latLng,
        map: this.map,
        clickable: true
   	  });

      marker.addListener('click', function (ev) {
        let ind:number = this.markers.indexOf(marker);

        let qu:string  = (this.questions[ind].Question == null) ? ("no question specified yet") : (this.questions[ind].Question);
        let ans:string = (this.questions[ind].Answer == null) ? ("no answer specified yet") : (this.questions[ind].Answer);

        let infoWindow = new google.maps.InfoWindow({
          content: "<h1>Question: " + qu + "</h1><br/><h3>Answer: " + ans + "</h3>"
        });
        infoWindow.open(this.map, marker);
      }.bind(this));

   	  this.markers.push(marker);
      this.map.panTo(e.latLng);
    }.bind(this));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreatePage');

    this.loadMap();
  }

  onMapClick() {
  	console.log("Map clicked!"); // I don't know why it works, but it does. Don't remove this line, because otherwise the list below the map won't update.
  }

  deleteQuestion(q:Question) {
    let ind:number = this.questions.indexOf(q);
    this.questions.splice(ind,1);
    this.markers[ind].setVisible(false);
    this.markers.splice(ind,1);
  }

  addOption(q:Question) {
    var opt = new Option();
    var lid = q.Options.length;
    if(lid == 0) {
      opt.Value = 1;
    } else {
      opt.Value = q.Options[lid-1].Value + 1;
    }
    q.Options.push(opt);
    console.log("Option added");
  }

  deleteOption(q:Question, o:Option) {
    let ind:number = q.Options.indexOf(o);
    q.Options.splice(ind,1);
  }

  setOption(q:Question, o:Option) {
    q.Answer = o.Value + "";
  }

  onSubmit() {
    if (this.isQuestValid()) {
      let questHeader:QuestHeader = {
        Id: "",
        Name: this.name,
        Start: "",
        Description: this.description,
        Latitude: this.questions[0].Latitude,
        Longitude: this.questions[0].Longitude
      };

      let quest:Quest = {
        header: questHeader,
        questions: this.questions
      };

      this.questionProvider.createQuest(quest).subscribe(
        res => {
          let alert;
          if(JSON.parse(res).Ok != 0) {
            alert = this.alertCtrl.create({
              title: 'Success',
              subTitle: 'The quest was submitted successfully',
              buttons: ['OK']
            });
          } else{
            alert = this.alertCtrl.create({
              title: 'Error',
              subTitle: 'There was an error with submitting the quest. The server sent this message: ' + JSON.parse(res).Ok,
              buttons: ['OK']
            });
          }
          alert.present();
        }
      );
    }
  }

  isQuestValid():boolean {
    let valid:boolean = true;
    let alert:any;

    if (this.name == null) {
      valid = false;
      alert = this.alertCtrl.create({
        title: 'Error',
        subTitle: 'You have not given a name for your new quest!',
        buttons: ['OK']
      });
      alert.present();
    } else if (this.description == null) {
      valid = false;
      alert = this.alertCtrl.create({
        title: 'Error',
        subTitle: 'You have not given a description for your new quest!',
        buttons: ['OK']
      });
      alert.present();
    } else if (this.questions.length == 0) {
      valid = false;
      alert = this.alertCtrl.create({
        title: 'Error',
        subTitle: 'There are no questions in your quest!',
        buttons: ['OK']
      });
      alert.present();
    } else {
      for (let i in this.questions) {
        if (valid && (this.questions[i].Question == null || this.questions[i].Answer == null)) {
          valid = false;
          let alert = this.alertCtrl.create({
            title: 'Error',
            subTitle: 'Question number ' + i + ' is invalid!',
            buttons: ['OK']
          });
          alert.present();
        } else {
          if(this.questions[i].Options.length == 1) {
            valid = false;
            let alert = this.alertCtrl.create({
              title: 'Error',
              subTitle: 'In question number ' + i + ' you adeed only one option.',
              buttons: ['OK']
            });
            alert.present();
          }
          for (let j in this.questions[i].Options) {
            if (valid && (this.questions[i].Options[j].Choice == null || this.questions[i].Options[j].Value == null)) {
              valid = false;
              let alert = this.alertCtrl.create({
                title: 'Error',
                subTitle: 'In question number ' + i + ', option ' + j + ' is invalid!',
                buttons: ['OK']
              });
              alert.present();
            }
          }
        }
      }
    }

    return valid;
  }
}
