import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import firebase from 'firebase';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  	
  	// searchAddress: string = "";
  	isLoggedIn: boolean; 
  	contactList: any;

  	constructor(public navCtrl: NavController, 
  		public af: AngularFireDatabase,
      public alertCtrl: AlertController) {
		 
		  this.isLoggedIn = true;
  	}

  	signOut() {
  		var self = this;
  		if(self.isLoggedIn){
  			alert("Please disable 'Stay Signed in' option to continue");
  		}
  		else{
  			firebase.auth().signOut().then(function() {
			  // Sign-out successful.
			  let alert = self.alertCtrl.create({
          message: "Successfully signed out",
          buttons: [
            {
              text: "Ok",
              role: 'cancel',
              handler: () => {
                
              }
            }
          ]
        });
        alert.present();
			  self.navCtrl.setRoot(LoginPage); 
			}).catch(function(error) {
			  // An error happened.
			  console.log("log out user error", error);
			});
  		}
  		
  	}
}