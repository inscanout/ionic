import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import firebase from 'firebase';
/**
 * Generated class for the BuddiesPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-buddies',
  templateUrl: 'buddies.html',
})
export class BuddiesPage {

	public buddiesList: Array<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams,
  	public af: AngularFireDatabase,
  	public alertCtrl: AlertController) {

  	this.loadBuddiesList();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BuddiesPage');
  }

  loadBuddiesList() {

  	//this.buddiesList = this.af.list('/groceryBuddiesList');
	var self = this;
  	var usersRef = firebase.database().ref('groceryBuddiesList'); 
  		usersRef.orderByChild("uid").equalTo(firebase.auth().currentUser.uid).once('value', function(snapshot) {
	        const userData = snapshot.val();
	        if (userData) {
	          	self.buddiesList =userData;
	        } else {
				let alert = self.alertCtrl.create({
		          message: "Please add a grocery buddy",
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
