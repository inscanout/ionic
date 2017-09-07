import { Component, NgZone } from '@angular/core';
import { 
  IonicPage, 
  NavController, 
  LoadingController, 
  Loading, 
  AlertController } from 'ionic-angular'


import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth';
import { EmailValidator } from '../../validators/email';
import { GooglePlus } from '@ionic-native/google-plus';
import { HomePage } from '../home/home';
import { Facebook } from '@ionic-native/facebook';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import firebase from 'firebase';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  public loginForm:FormGroup;
  public loading:Loading;
  userProfile: any = null;
  zone: NgZone;
  userProfileFb: any = null;
  userProfileGoogle: any = null;
  public regUsersList: FirebaseListObservable<any>;

    constructor(public navCtrl: NavController, public authData: AuthProvider, 
      public formBuilder: FormBuilder, public alertCtrl: AlertController,
      public loadingCtrl: LoadingController, private googlePlus: GooglePlus, 
      private facebook: Facebook,
      public af: AngularFireDatabase
      ) {

        this.loginForm = formBuilder.group({
          email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
          password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
        });

        this.zone = new NgZone({});
        firebase.auth().onAuthStateChanged( user => {
          this.zone.run( () => {
            if (user){
              this.userProfile = user;
            } else { 
              this.userProfile = null; 
            }
          });
        });
       this.regUsersList = af.list('/registeredUsers');
    }

    loginUser(){
      if (!this.loginForm.valid){
        console.log(this.loginForm.value);
      } else {

        this.loading = this.loadingCtrl.create({
          dismissOnPageChange: true,
        });
        this.loading.present();

        this.authData.loginUser(this.loginForm.value.email, this.loginForm.value.password)
        .then( authData => {
          this.loading.dismiss().then( () => {
            this.navCtrl.setRoot(HomePage);
          });
        }, error => {
          this.loading.dismiss().then( () => {
            let alert = this.alertCtrl.create({
              message: error.message,
              buttons: [
                {
                  text: "Ok",
                  role: 'cancel'
                }
              ]
            });
            alert.present();
          });
        });

        
      }
    }

    presentPrompt(userProfile) {
      var self = this;
      let alert = this.alertCtrl.create({
        title: 'User Details',
        inputs: [
          {
            name: 'phoneNumber',
            placeholder: 'Please enter phone number'
          }
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: data => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Submit',
            handler: data => {
              self.regUsersList.push({
                email: userProfile.email,
                phone: data.phoneNumber,
                uid: userProfile.uid
              });
            }
          }
        ]
      });
      alert.present();
    }
    checkForFirstTime(userProfile) {
      var self = this;
      var usersRef = firebase.database().ref('registeredUsers');  
      usersRef.orderByChild("uid").equalTo(userProfile.uid).once('value', function(snapshot) {
        const userData = snapshot.val();
        if (userData) {
          //alert('user ' + userProfile.uid + ' exists!');
        } else {
          //alert('user ' + userProfile.uid + ' does not exist!');
          self.presentPrompt(userProfile);
        }
      });

    }
    
    goToResetPassword(){
      this.navCtrl.push('ResetPasswordPage');
    }

    createAccount(){
      this.navCtrl.push('SignupPage');
    }

    loginUserWithGoogle(): void {
      
      this.loading = this.loadingCtrl.create({
        dismissOnPageChange: true,
      });
      this.loading.present();

      this.googlePlus.login({
        'webClientId': '1019366618900-8l2sm0dqgnusg1slnrjdlnmbqe3ggntn.apps.googleusercontent.com',
        'offline': true
      }).then( res => {
        firebase.auth().signInWithCredential(firebase.auth.GoogleAuthProvider.credential(res.idToken))
          .then( success => {
            //console.log("Firebase success: " + JSON.stringify(success));
            
            this.loading.dismiss().then( () => {
              this.navCtrl.setRoot(HomePage);
              this.userProfileGoogle = success;
              this.checkForFirstTime(this.userProfileGoogle);
              
            });
          })
          .catch( error => {
            this.loading.dismiss().then( () => {
              let alert = this.alertCtrl.create({
                message: error.message,
                buttons: [
                  {
                    text: "Ok",
                    role: 'cancel'
                  }
                ]
              });
              alert.present();
            });
            console.log("Firebase failure: " + JSON.stringify(error));
          });
        }).catch(err => {
          this.loading.dismiss().then( () => {
            let alert = this.alertCtrl.create({
              message: err.message,
              buttons: [
                {
                  text: "Ok",
                  role: 'cancel'
                }
              ]
            });
            alert.present();
          });
          console.log("Error: ", err)}
        );
    }

    facebookLogin(){

      this.loading = this.loadingCtrl.create({
        dismissOnPageChange: true,
      });
      this.loading.present();

      this.facebook.login(['email']).then( (response) => {
          const facebookCredential = firebase.auth.FacebookAuthProvider
              .credential(response.authResponse.accessToken);

          firebase.auth().signInWithCredential(facebookCredential)
          .then((success) => {
              console.log("Firebase success: " + JSON.stringify(success));
              this.loading.dismiss().then( () => {
                this.navCtrl.setRoot(HomePage);
              });
              this.userProfileFb = success;
              this.checkForFirstTime(this.userProfileFb);
          })
          .catch((error) => {
              console.log("Firebase failure: " + JSON.stringify(error));
              this.loading.dismiss().then( () => {
                let alert = this.alertCtrl.create({
                  message: error.message,
                  buttons: [
                    {
                      text: "Ok",
                      role: 'cancel'
                    }
                  ]
                });
                alert.present();
              });
          });

      }).catch((error) => { 
        console.log(error) 
        this.loading.dismiss().then( () => {
          let alert = this.alertCtrl.create({
            message: error.message,
            buttons: [
              {
                text: "Ok",
                role: 'cancel'
              }
            ]
          });
          alert.present();
        });
      });
    }

}
