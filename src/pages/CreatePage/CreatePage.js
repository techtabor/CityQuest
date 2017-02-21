var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Option } from '../../models/Option';
import { Question } from '../../models/Question';
import { QuestionProvider } from '../../providers/QuestionProvider';
import { GeoLocationProvider } from '../../providers/GeoLocationProvider';
/*
  Generated class for the CreatePage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
var CreatePage = (function () {
    function CreatePage(navCtrl, navParams, alertCtrl, geoLocationProvider, questionProvider) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.alertCtrl = alertCtrl;
        this.geoLocationProvider = geoLocationProvider;
        this.questionProvider = questionProvider;
        this.markers = Array();
        this.questions = Array();
    }
    CreatePage.prototype.loadMap = function () {
        console.log('Loading map');
        var latLng = new google.maps.LatLng(this.geoLocationProvider.getLocation().latitude, this.geoLocationProvider.getLocation().longitude);
        //let latLng = new google.maps.LatLng(46.15,19);
        var mapOptions = {
            center: latLng,
            zoom: 13,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
        this.map.addListener('click', function (e) {
            var q = new Question();
            q.Latitude = e.latLng.lat();
            q.Longitude = e.latLng.lng();
            q.Options = new Array();
            this.questions.push(q);
            var marker = new google.maps.Marker({
                position: e.latLng,
                map: this.map,
                clickable: true
            });
            marker.addListener('click', function (ev) {
                var ind = this.markers.indexOf(marker);
                var qu = (this.questions[ind].Question == null) ? ("no question specified yet") : (this.questions[ind].Question);
                var ans = (this.questions[ind].Answer == null) ? ("no answer specified yet") : (this.questions[ind].Answer);
                var infoWindow = new google.maps.InfoWindow({
                    content: "<h1>Question: " + qu + "</h1><br/><h3>Answer: " + ans + "</h3>"
                });
                infoWindow.open(this.map, marker);
            }.bind(this));
            this.markers.push(marker);
            this.map.panTo(e.latLng);
        }.bind(this));
    };
    CreatePage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad CreatePage');
        this.loadMap();
    };
    CreatePage.prototype.onMapClick = function () {
        console.log("Map clicked!"); // I don't know why it works, but it does. Don't remove this line, because otherwise the list below the map won't update.
    };
    CreatePage.prototype.deleteQuestion = function (q) {
        var ind = this.questions.indexOf(q);
        this.questions.splice(ind, 1);
        this.markers[ind].setVisible(false);
        this.markers.splice(ind, 1);
    };
    CreatePage.prototype.addOption = function (q) {
        var opt = new Option();
        var lid = q.Options.length;
        if (lid == 0) {
            opt.Value = 1;
        }
        else {
            opt.Value = q.Options[lid - 1].Value + 1;
        }
        q.Options.push(opt);
        console.log("Option added");
    };
    CreatePage.prototype.deleteOption = function (q, o) {
        var ind = q.Options.indexOf(o);
        q.Options.splice(ind, 1);
    };
    CreatePage.prototype.setOption = function (q, o) {
        q.Answer = o.Value + "";
    };
    CreatePage.prototype.onSubmit = function () {
        var _this = this;
        if (this.isQuestValid()) {
            var questHeader = {
                Id: "",
                Name: this.name,
                Start: "",
                Description: this.description,
                Latitude: this.questions[0].Latitude,
                Longitude: this.questions[0].Longitude
            };
            var quest = {
                header: questHeader,
                questions: this.questions
            };
            this.questionProvider.createQuest(quest).subscribe(function (res) {
                var alert;
                if (JSON.parse(res).Ok != 0) {
                    alert = _this.alertCtrl.create({
                        title: 'Success',
                        subTitle: 'The quest was submitted successfully',
                        buttons: ['OK']
                    });
                }
                else {
                    alert = _this.alertCtrl.create({
                        title: 'Error',
                        subTitle: 'There was an error with submitting the quest. The server sent this message: ' + JSON.parse(res).Ok,
                        buttons: ['OK']
                    });
                }
                alert.present();
            });
        }
    };
    CreatePage.prototype.isQuestValid = function () {
        var valid = true;
        var alert;
        if (this.name == null) {
            valid = false;
            alert = this.alertCtrl.create({
                title: 'Error',
                subTitle: 'You have not given a name for your new quest!',
                buttons: ['OK']
            });
            alert.present();
        }
        else if (this.description == null) {
            valid = false;
            alert = this.alertCtrl.create({
                title: 'Error',
                subTitle: 'You have not given a description for your new quest!',
                buttons: ['OK']
            });
            alert.present();
        }
        else if (this.questions.length == 0) {
            valid = false;
            alert = this.alertCtrl.create({
                title: 'Error',
                subTitle: 'There are no questions in your quest!',
                buttons: ['OK']
            });
            alert.present();
        }
        else {
            for (var i in this.questions) {
                if (valid && (this.questions[i].Question == null || this.questions[i].Answer == null)) {
                    valid = false;
                    var alert_1 = this.alertCtrl.create({
                        title: 'Error',
                        subTitle: 'Question number ' + i + ' is invalid!',
                        buttons: ['OK']
                    });
                    alert_1.present();
                }
                else {
                    if (this.questions[i].Options.length == 1) {
                        valid = false;
                        var alert_2 = this.alertCtrl.create({
                            title: 'Error',
                            subTitle: 'In question number ' + i + ' you adeed only one option.',
                            buttons: ['OK']
                        });
                        alert_2.present();
                    }
                    for (var j in this.questions[i].Options) {
                        if (valid && (this.questions[i].Options[j].Choice == null || this.questions[i].Options[j].Value == null)) {
                            valid = false;
                            var alert_3 = this.alertCtrl.create({
                                title: 'Error',
                                subTitle: 'In question number ' + i + ', option ' + j + ' is invalid!',
                                buttons: ['OK']
                            });
                            alert_3.present();
                        }
                    }
                }
            }
        }
        return valid;
    };
    return CreatePage;
}());
__decorate([
    ViewChild('map'),
    __metadata("design:type", ElementRef)
], CreatePage.prototype, "mapElement", void 0);
CreatePage = __decorate([
    Component({
        selector: 'page-create',
        templateUrl: 'CreatePage.html',
    }),
    __metadata("design:paramtypes", [NavController,
        NavParams,
        AlertController,
        GeoLocationProvider,
        QuestionProvider])
], CreatePage);
export { CreatePage };
//# sourceMappingURL=CreatePage.js.map