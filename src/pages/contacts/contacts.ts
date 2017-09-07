import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Contacts } from 'ionic-native';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
/**
 * Generated class for the ContactsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-contacts',
  templateUrl: 'contacts.html',
})
export class ContactsPage {
	public contactList: any;
	public regUsersList: FirebaseListObservable<any>;

  	constructor(public navCtrl: NavController, 
  		public navParams: NavParams, 
  		public af: AngularFireDatabase) {

  		this.regUsersList = af.list('/registeredUsers');
  		
	    // af.list('/registeredUsers', { preserveSnapshot: true})
    	// 	.subscribe(snapshots=>{
	    //     snapshots.forEach(snapshot => {
	    //       console.log(snapshot.key, snapshot.val());
	    //     });
	    // });
	  	var opts = {   
	     // filter : "M",                                
	      multiple: true,        
	      hasPhoneNumber:true,                             
	      fields:  [ 'displayName', 'name' ]
	    };
	    Contacts.find([ 'displayName', 'name' ],opts).then((contacts) => {
	      this.contactList = contacts;
	      this.contactList.forEach((contact)=>{

	      	var str = contact.phoneNumbers[0].value;
	      	str = str.substring(str.length-10);
	      });
	      console.log(contacts);
	      
	      //this.showRegisteredUsersFromContacts();
	    }, (error) => {
	      console.log("Could not find contacts",error);
	    });
  	}

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactsPage');
  }

}
