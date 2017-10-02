import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
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
  		public af: AngularFireDatabase,
  		public alertCtrl: AlertController) {

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
	      alert("Could not find contacts"+error);
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
  		var buddyRef = firebase.database().ref('groceryBuddies');  
  		this.contactList.forEach((contact) => {
  			//check if contact is a registered user- use phone number
      		contact.phoneNumbers.forEach((phone) => {
  				var str = phone.value.replace(/\s/g,'');
  				str = str.substring(str.length-10);
  				usersRef.orderByChild("phone").equalTo(str).once('value', function(snapshot) {
			        const userData = snapshot.val();
			        if (userData) {
			          	contact['IsRegisteredUser'] = true;
			          	Object.keys(userData).forEach(function(key) {
					        //console.log(key, userData[key]);
					        contact['uid'] = userData[key].uid;
					    });
					    
			          	
			        } else {
			        	contact['IsRegisteredUser'] = false;
			        	//contact['isBuddy']= false;
			        }
			    });
			  //  //usersRef.orderByChild("userUID").orderByChild("buddyUID")
  			})
  		});


  		buddyRef.orderByChild("userUID").equalTo(firebase.auth().currentUser.uid)
	    //.orderByChild("buddyUID")
	    .once('value', function(snapshot1) {
	    	const buddyData = snapshot1.val();
	    	if(buddyData){
	    		alert("has buddies");
	    	}else{
	    		alert("no buddies added");
	    	}
	    });
  		
  	}


  	presentConfirm() {
	  const alert = this.alertCtrl.create({
	    title: 'Confirm purchase',
	    message: 'Do you want to buy this book?',
	    buttons: [
	      {
	        text: 'Cancel',
	        role: 'cancel',
	        handler: () => {
	          console.log('Cancel clicked');
	        }
	      },
	      {
	        text: 'Buy',
	        handler: () => {
	          console.log('Buy clicked');
	        }
	      }
	    ]
	  });
	  alert.present();
	}

  	inviteToBuddyList(contact) {
  		var self = this;
  		var usersRef = firebase.database().ref('groceryBuddies'); 

  		//confirm if user want to add this contat as buddy
  		this.presentConfirm();

  		// usersRef.orderByChild("buddyUID").equalTo(contact.uid).once('value', function(snapshot) {
			 //        const userData = snapshot.val();
			 //        if (userData && userData.userUID == firebase.auth().currentUser.uid) {
			 //          	//contact
			 //          	Object.keys(userData).forEach(function(key) {
				// 	        console.log(key, userData[key]);
				// 	        if(userData[key].buddyUID && userData[key])
				// 	        this.buddiesList.push({
				// 	        	buddyName: userData[key].buddyUIDbuddyName,
				// 	        	buddyPhone: userData[key].buddyPhone
				// 	        })
				// 	    });
			          	
			 //        } else {
			 //        	//add to grocery buddies list mapping if buddy does not exists
			 //          	self.groceryBuddiesList.push({
			 //          		userUID: firebase.auth().currentUser.uid,
			 //          		buddyUID: contact.uid,
			 //          		buddyName: contact.displayName,
			 //          		buddyPhone: contact.phoneNumbers[0].value,
			 //          		IsBuddy: true
			 //          	});
			 //          	contact['showIcon'] = false;
			 //          	var cntFiltered = self.contactList.filter((cont)=> {
			 //          		return contact.uid == cont.uid;
			 //          	})[0];
			 //          	cntFiltered.showIcon = false;
			 //          	alert("Contact added to the list of grocery buddies");
			 //        }
			 //    }); 
  	}
}
  	

