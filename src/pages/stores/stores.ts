import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { Network } from '@ionic-native/network';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import firebase from 'firebase';

declare var google;
declare var Connection;

@IonicPage()
@Component({
  selector: 'page-stores',
  templateUrl: 'stores.html',
})

export class StoresPage {

  	searchAddress: string = "";
	map: any;
  	mapInitialised: boolean = false;
  	apiKey: any;
  	online: boolean;
  	places: Array<any>; 
  	autocompleteItems: any;
	autocomplete: any;
	acService:any;
	public preferredStoresList: FirebaseListObservable<any>;

  	constructor(public navCtrl: NavController, 
	  	//public connectivityService: ConnectivityServiceProvider,
	  	public geolocation: Geolocation,
	  	public navParams: NavParams,
	  	private network: Network,
	  	public af: AngularFireDatabase,
	  	public alertCtrl: AlertController) {

  		this.network.onConnect().subscribe(res=>{
	      	this.online=true;
	      	return this.online;
	    });

	    this.network.onDisconnect().subscribe(res=>{
	      	this.online=false;
	      	return this.online;
	    });
	    this.preferredStoresList = this.af.list('/preferredStores');
	  	
	  	
  	}

  	ngOnInit() {
  		      
		this.autocompleteItems = [];
		this.autocomplete = {
			query: ''
		};   
		
		let alert = this.alertCtrl.create({
          message: "Please wait until the map is loaded",
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
    	this.loadGoogleMaps();
  	}


    loadGoogleMaps(){
 
    	this.addConnectivityListeners();
 
  		if(typeof google == "undefined" || typeof google.maps == "undefined"){
 
		    console.log("Google maps JavaScript needs to be loaded.");
		    this.disableMap();
 
    		if(this.online || this.network.type !== Connection.NONE){
      			console.log("online, loading map");
 
		      	//Load the SDK
		      	window['mapInit'] = () => {
					this.initMap();
					this.enableMap();
	     		}
 
	      		let script = document.createElement("script");
	      		script.id = "googleMaps";
	 
	      		if(this.apiKey){
					script.src = 'http://maps.google.com/maps/api/js?key=' + this.apiKey + '&callback=mapInit&libraries=places';
	      		} else {
					script.src = 'http://maps.google.com/maps/api/js?callback=mapInit&libraries=places';       
	      		}
 
      			document.body.appendChild(script);  
 
    		} 
  		}
  		else {
 			
		    if(this.online || this.network.type !== Connection.NONE){
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

  	addMarker(){
  		
	    let marker = new google.maps.Marker({
		    map: this.map,
		    animation: google.maps.Animation.DROP,
		    position: this.map.getCenter()
	    });

	    

	}

  	initMap(){
 
    	this.mapInitialised = true;
 		
	    let options = {
	      enableHighAccuracy: true
	    };
	    
	    this.geolocation.getCurrentPosition(options).then((position: Geoposition) => {
	        let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
	 
	    	let mapOptions = {
					center: latLng,
					zoom: 15,
					mapTypeId: google.maps.MapTypeId.ROADMAP
		    }
			
	    		//this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
	        this.map = new google.maps.Map(document.getElementById('map'), mapOptions);
	        this.getStores(latLng).then((results : Array<any>)=>{
		        this.places = results;
		        for(let i = 0 ;i < results.length ; i++)
		        {
		            this.createMarker(results[i]);
		        }
		    },(status)=>console.log(status));

    		this.addMarker();
	    }).catch((err) => {
	        console.log('Error getting location'+ err.message);
	        let alert = this.alertCtrl.create({
	          message: err.message,
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
	        this.map = new google.maps.Map(document.getElementById('map'), {
	          center: new google.maps.LatLng(0, 0),//{lat: -34.397, lng: 150.644},
	          zoom: 15,
	          mapTypeId: google.maps.MapTypeId.ROADMAP
	        });

	        
	    });
     
  	}
 
  	disableMap(){
    	console.log("disable map");
  	}

  	enableMap(){
    	console.log("enable map");
    	this.acService = new google.maps.places.AutocompleteService();
  	}

  	getStores(latLng) {
  		if(this.map !== undefined){
  			 var service = new google.maps.places.PlacesService(this.map);
  		}
	   	else{
	   		 var service = new google.maps.places.PlacesService(document.createElement('div'));
	   	}
	    let request = {
	        location : latLng,
	        radius : 2000 ,//in metres
	        types: ["store"]//home_goods_store, shopping_mall, convenience_store
	    };
	    return new Promise((resolve,reject)=>{
	        service.nearbySearch(request,function(results,status){
	            if(status === google.maps.places.PlacesServiceStatus.OK) {
	                resolve(results);    
	            }
	            else {
	                reject(status);
	            }

	        }); 
	    });

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

	createMarker(place) {
	    let marker = new google.maps.Marker({
		    map: this.map,
		    animation: google.maps.Animation.DROP,
		    position: place.geometry.location
	    }); 
	    
	    let content = "<p>"+place.name+"</p>";          
	    let infoWindow = new google.maps.InfoWindow({
	    	content: content
	    });

	    google.maps.event.addListener(marker, 'click', () => {
	    	infoWindow.open(this.map, marker);
	    	this.addItemToPreferredStorelist(place);
	    });  
	} 

	updateSearch() {
		console.log('modal > updateSearch');
		if (this.autocomplete.query == '') {
			this.autocompleteItems = [];
			return;
		}
		let self = this; 
		let config = { 
			types:  ['establishment'], // other types: 'geocode', 'regions', and 'cities'
			input: self.autocomplete.query, 
			componentRestrictions: {  country: ['US', 'IN'] } 
		}
		
		var geocoder = new google.maps.Geocoder();

		self.acService.getPlacePredictions(config, function (predictions, status) {
			console.log('modal > getPlacePredictions > status > ', status);
			if(status == 'ZERO_RESULTS'){

			    geocoder.geocode({address: self.autocomplete.query}, function(results, status) {
			       if (status == google.maps.GeocoderStatus.OK) {
			        //alert("got adrress loc");//searchLocationsNear(results[0].geometry.location);
			       } else {
			        alert(self.autocomplete.query + ' not found');
			       }
			    });
			}
			else{
				self.autocompleteItems = [];            
				predictions.forEach(function (prediction) {              
					self.autocompleteItems.push(prediction);
				});
			}
			
		});
	}

	chooseItem(item) {
		this.autocomplete.query = item.description;
		
		this.addItemToPreferredStorelist(item);
	}
	addItemToPreferredStorelist(item) {
		var self = this;
		if(item.place_id && item.place_id !== ""){
			if(this.map === undefined){
				var service = new google.maps.places.PlacesService(this.map);
			}else{
				var service = new google.maps.places.PlacesService(document.createElement('div'));
			}
			
			service.getDetails({
	          placeId: item.place_id
	        }, function(place, status) {
	          if (status === google.maps.places.PlacesServiceStatus.OK) {
				var usersRef = firebase.database().ref('preferredStores'); 
		  		usersRef.orderByChild("uid").equalTo(firebase.auth().currentUser.uid).once('value', function(snapshot) {
			        const userData = snapshot.val();
			        if (userData) {
			          	var isStorexists: boolean = false;
			          	Object.keys(userData).forEach(function(key) {
					        if(userData[key].latitude === place.geometry.location.lat() && 
					        	userData[key].longitude === place.geometry.location.lng()){
					        	isStorexists = true;
					        }
					    });
					    if(isStorexists == false){
					    	self.preferredStoresList.push({
								store: item.description,
								latitude: place.geometry.location.lat(),
								longitude: place.geometry.location.lng(),
								uid: firebase.auth().currentUser.uid
							});
							self.dismiss();
							self.autocompleteItems = [];
					    }
					    else{
					    	alert("Store already exist");
					    }
					    
			          	
			        } else {
						self.preferredStoresList.push({
							store: item.description,
							latitude: place.geometry.location.lat(),
							longitude: place.geometry.location.lng(),
							uid: firebase.auth().currentUser.uid
						});
						alert("Successfully added to preferred stores list");
						self.dismiss();
						self.autocompleteItems = [];
			        }
			    }); 
	            
	          }
	        });
			
		}
		
	}
	dismiss() {
		this.autocomplete.query = "";
		
	}

}  
 

