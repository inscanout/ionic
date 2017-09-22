import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-preferred-stores',
  templateUrl: 'preferred-stores.html',
})
export class PreferredStoresPage {

	public preferredStoresList: Array<any>;

  	constructor(public navCtrl: NavController, 
  	public navParams: NavParams,
  	public af: AngularFireDatabase,
  	public alertCtrl: AlertController) {
  		this.displayPreferredStoresList();
  	}

  	ionViewDidLoad() {
    	console.log('ionViewDidLoad PreferredStoresPage');
  	}

  	displayPreferredStoresList() {
  		var self = this;
  		self.preferredStoresList = [];
  		var usersRef = firebase.database().ref('preferredStores'); 
  		usersRef.orderByChild("uid").equalTo(firebase.auth().currentUser.uid).once('value', function(snapshot) {
	        const userData = snapshot.val();
	        if (userData) {
	          	Object.keys(userData).forEach(function(key) {
			        if(userData[key].store !== ""){
			        	self.preferredStoresList.push({
			        		store: userData[key].store,
			        		latitude: userData[key].latitude,
			        		longitude: userData[key].longitude
			        	});
			        }
			    });
	        } else {
				let alert = self.alertCtrl.create({
		          message: "Please set a preferred store.",
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
		    }
		}); 

  	}
}
