import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Network } from 'ionic-native';
import { Platform } from 'ionic-angular';
/*
  Generated class for the ConnectivityServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
declare var Connection;

@Injectable()
export class ConnectivityServiceProvider {

  onDevice: boolean;
 
  constructor(public platform: Platform){
    this.onDevice = this.platform.is('cordova');
  }
 
  isOnline(): boolean {
    if(this.onDevice && Network.type){
      return Network.type !== Connection.NONE;
    } else {
      return navigator.onLine; 
    }
  }
 
  isOffline(): boolean {
    if(this.onDevice && Network.type){
      return Network.type === Connection.NONE;
    } else {
      return !navigator.onLine;   
    }
  }

}
