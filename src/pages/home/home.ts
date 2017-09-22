import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import { SettingsPage } from '../settings/settings';
import { ContactsPage } from '../contacts/contacts';
import { StoresPage } from '../stores/stores';
import { PreferredStoresPage } from '../preferred-stores/preferred-stores';
import { BuddiesPage } from '../buddies/buddies';

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
  private storesPage;
  private preferredStoresPage;
  private buddiesPage;

  constructor(public navCtrl: NavController, public navParams: NavParams) {

    this.contactsPage = ContactsPage;
    this.settingsPage = SettingsPage;
    this.storesPage = StoresPage;
    this.preferredStoresPage = PreferredStoresPage;
    this.buddiesPage = BuddiesPage;
  }

  openPage(p) {
    this.rootPage = p;
  }

}