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

import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  public loginForm:FormGroup;
  public loading:Loading;
  userProfile: any = null;
  zone: NgZone;

    constructor(public navCtrl: NavController, public authData: AuthProvider, 
      public formBuilder: FormBuilder, public alertCtrl: AlertController,
      public loadingCtrl: LoadingController, private googlePlus: GooglePlus) {

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
      
    }

    loginUser(){
      if (!this.loginForm.valid){
        console.log(this.loginForm.value);
      } else {
        this.authData.loginUser(this.loginForm.value.email, this.loginForm.value.password)
        .then( authData => {
          this.navCtrl.setRoot('HomePage');
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

        this.loading = this.loadingCtrl.create({
          dismissOnPageChange: true,
        });
        this.loading.present();
      }
    }

    goToResetPassword(){
      this.navCtrl.push('ResetPasswordPage');
    }

    createAccount(){
      this.navCtrl.push('SignupPage');
    }

  loginUserWithGoogle(): void {
    

      this.googlePlus.login({
        'webClientId': '1019366618900-8l2sm0dqgnusg1slnrjdlnmbqe3ggntn.apps.googleusercontent.com',
        'offline': true
      }).then( res => {
        firebase.auth().signInWithCredential(firebase.auth.GoogleAuthProvider.credential(res.idToken))
          .then( success => {
            console.log("Firebase success: " + JSON.stringify(success));
            this.navCtrl.setRoot('HomePage');
          })
          .catch( error => console.log("Firebase failure: " + JSON.stringify(error)));
        }).catch(err => console.log("Error: ", err));
  }

  

}
