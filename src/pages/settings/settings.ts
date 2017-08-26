import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

// import firebase from 'firebase';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  
  constructor(public navCtrl: NavController) {}
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad AppSettingsPage');
  }
  
}