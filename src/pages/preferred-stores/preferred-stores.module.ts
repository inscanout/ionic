import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PreferredStoresPage } from './preferred-stores';

@NgModule({
  declarations: [
    PreferredStoresPage,
  ],
  imports: [
    IonicPageModule.forChild(PreferredStoresPage),
  ],
  exports: [
    PreferredStoresPage
  ]
})
export class PreferredStoresPageModule {}
