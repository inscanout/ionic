import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Contacts } from 'ionic-native';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import firebase from 'firebase';

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
	public groceryBuddiesList: FirebaseListObservable<any>;
	public invitation: FirebaseListObservable<any>;

  	constructor(public navCtrl: NavController, 
  		public navParams: NavParams, 
  		public af: AngularFireDatabase) {

  		this.groceryBuddiesList= af.list('/groceryBuddiesList');
  		this.invitation= af.list('/invitation');

	  	var opts = {   
	     // filter : "M",                                
	      multiple: true,        
	      hasPhoneNumber:true,                             
	      fields:  [ 'displayName', 'name' ]
	    };
	    Contacts.find([ 'displayName', 'name' ],opts).then((contacts) => {
	      this.contactList = contacts;
	      this.showRegisteredUsersFromContacts();
	    }, (error) => {
	      console.log("Could not find contacts",error);
	    });
  	}

  	ionViewDidLoad() {
    	//console.log('ionViewDidLoad ContactsPage');
  	}
  	sendInvitation(contact) {
  		this.invitation.push({
  			userName: firebase.auth().currentUser.displayName,
  			userUID: firebase.auth().currentUser.uid,
  			buddyUID: contact.uid,
			buddyName: contact.displayName
  		});


  	}

  //show users already registered in contacts with an icon
  	showRegisteredUsersFromContacts() {
  		var usersRef = firebase.database().ref('registeredUsers');  
  		this.contactList.forEach((contact) => {
      		contact.phoneNumbers.forEach((phone) => {
  				var str = phone.value.replace(/\s/g,'');
  				str = str.substring(str.length-10);
  				usersRef.orderByChild("phone").equalTo(str).once('value', function(snapshot) {
			        const userData = snapshot.val();
			        if (userData) {
			          	contact['showIcon'] = true;
			          	Object.keys(userData).forEach(function(key) {
					        console.log(key, userData[key]);
					        contact['uid'] = userData[key].uid;
					    });
			          	
			        } else {
			        	contact['showIcon'] = false;
			        	contact['isBuddy']= false;
			        }
			    });
  			})
  		})
  		
  	}

  	inviteGroceryBuddies(contact) {
  		var self = this;
  		var usersRef = firebase.database().ref('groceryBuddiesList'); 
  		usersRef.orderByChild("buddyUID").equalTo(contact.uid).once('value', function(snapshot) {
			        const userData = snapshot.val();
			        if (userData && userData.userUID == firebase.auth().currentUser.uid) {
			          	//contact
			          	
			        } else {
			        	//add to grocery buddies list mapping if buddy does not exists
			          	self.groceryBuddiesList.push({
			          		userUID: firebase.auth().currentUser.uid,
			          		buddyUID: contact.uid,
			          		buddyName: contact.displayName
			          		//phNum: contact.phNum
			          	});
			          	contact['showIcon'] = false;
			          	var cntFiltered = self.contactList.filter((cont)=> {
			          		return contact.uid == cont.uid;
			          	})[0];
			          	cntFiltered.showIcon = false;
			          	alert("Contact added to the list of grocery buddies");
			        }
			    }); 
  	}

}
