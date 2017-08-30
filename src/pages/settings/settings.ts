import { Component, ElementRef, ViewChild  } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ConnectivityServiceProvider } from '../../providers/connectivity-service/connectivity-service';
import { Geolocation } from 'ionic-native';
import { Contacts } from 'ionic-native';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

declare var google;
// import firebase from 'firebase';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  	
  	@ViewChild('map') mapElement: ElementRef;
  	public regUsersList: FirebaseListObservable<any>;

  	searchAddress: string = "";
  	isLoggedIn: boolean = false; 
  	map: any;
  	mapInitialised: boolean = false;
  	apiKey: any;
  	contactList: any;

  	constructor(public navCtrl: NavController, 
  		public connectivityService: ConnectivityServiceProvider,
  		public Geolocation: Geolocation,
  		public af: AngularFireDatabase) {
  		
  		var opts = {   
          filter : "M",                                
          multiple: true,        
          hasPhoneNumber:true,                             
          fields:  [ 'displayName', 'name' ]
        };
        Contacts.find([ 'displayName', 'name' ],opts).then((contacts) => {
          this.contactList=contacts;
          this.showRegisteredUsersFromContacts();
        }, (error) => {
          console.log("Could not find contacts",error);
        });

        
        
  		
		this.loadGoogleMaps()
		// isLoggedIn = true;
  	}

  	//show users already registered in contacts with an icon
  	showRegisteredUsersFromContacts() {
  		this.regUsersList = this.af.list('/registeredUsers');
  		this.regUsersList.subscribe(user => {
		  console.log(user);
		  
		});
  		console.log("contactList",this.contactList);
  		//console.log("regUsersList",this.regUsersList);
  		this.contactList.forEach((contact) => {
  			this.regUsersList.forEach((user) => {
  				console.log("ph", user.phone);
  				contact.phoneNumbers.forEach((phone) => {
  					if((phone.value).indexOf(user.phone) >= 0){
	  					contact.showIcon = true;
	  				}
  				})
  				
  			})
  			//console.log("contact ph:", contact.phoneNumbers)
  		})
  		
  	}

  	// ionViewDidLoad() {
   //  	console.log('ionViewDidLoad AppSettingsPage');
  	// }
 	
 	
  	loadGoogleMaps(){
 
    	this.addConnectivityListeners();
 
  		if(typeof google == "undefined" || typeof google.maps == "undefined"){
 
		    console.log("Google maps JavaScript needs to be loaded.");
		    this.disableMap();
 
    		if(this.connectivityService.isOnline()){
      			console.log("online, loading map");
 
		      	//Load the SDK
		      	window['mapInit'] = () => {
					this.initMap();
					this.enableMap();
	     		}
 
	      		let script = document.createElement("script");
	      		script.id = "googleMaps";
	 
	      		if(this.apiKey){
					script.src = 'http://maps.google.com/maps/api/js?key=' + this.apiKey + '&callback=mapInit';
	      		} else {
					script.src = 'http://maps.google.com/maps/api/js?callback=mapInit';       
	      		}
 
      			document.body.appendChild(script);  
 
    		} 
  		}
  		else {
 
		    if(this.connectivityService.isOnline()){
		      console.log("showing map");
		      this.initMap();
		      this.enableMap();
		    }
		    else {
		      console.log("disabling map");
		      this.disableMap();
		    }
 
  		}
 
  	}

  	initMap(){
 
    	this.mapInitialised = true;
 
    	Geolocation.getCurrentPosition().then((position) => {
 
      		let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
 
	    	let mapOptions = {
				center: latLng,
				zoom: 15,
				mapTypeId: google.maps.MapTypeId.ROADMAP
		    }
 			//alert(position.coords.latitude + position.coords.longitude);
      		this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
 
    	});
 
  	}
 
  	disableMap(){
    	console.log("disable map");
  	}

  	enableMap(){
    	console.log("enable map");
  	}

  	addConnectivityListeners(){
 
    let onOnline = () => {
 
      	setTimeout(() => {
			if(typeof google == "undefined" || typeof google.maps == "undefined"){
		  		this.loadGoogleMaps();
			} else {
			  	if(!this.mapInitialised){
			    	this.initMap();
			  	}
		  		this.enableMap();
			}
      	}, 2000);
 
    };
 
    let onOffline = () => {
      this.disableMap();
    };
 
    document.addEventListener('online', onOnline, false);
    document.addEventListener('offline', onOffline, false);
 }
  searchLocation() {
  	alert("search loc");
	var address = this.searchAddress;
     var geocoder = new google.maps.Geocoder();
     geocoder.geocode({address: address}, function(results, status) {
       if (status == google.maps.GeocoderStatus.OK) {
        alert("got adrress loc");//searchLocationsNear(results[0].geometry.location);
       } else {
        alert(address + ' not found');
       }
     });
  }
}