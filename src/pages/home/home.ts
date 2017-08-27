import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import { SettingsPage } from '../settings/settings';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  tab1Root: any;
  
  
  constructor(public navCtrl: NavController) {
    this.tab1Root = SettingsPage;
  }

}
