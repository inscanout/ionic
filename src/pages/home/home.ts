import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import { SettingsPage } from '../settings/settings';
import { ContactsPage } from '../contacts/contacts';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  tab1Root: any;
  tab2Root: any;
  private rootPage;
  private contactsPage;
  private settingsPage;


  constructor(public navCtrl: NavController, public navParams: NavParams) {
    // this.tab1Root = SettingsPage;
    // this.tab2Root = ContactsPage;

    this.contactsPage = ContactsPage;
    this.settingsPage = SettingsPage;
  }

  openPage(p) {
    this.rootPage = p;
  }

}