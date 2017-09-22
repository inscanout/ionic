import { Component } from '@angular/core';
import { 
  IonicPage, 
  NavController, 
  LoadingController, 
  Loading, 
  AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth';
import { HomePage } from '../home/home';
import { EmailValidator } from '../../validators/email';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  public signupForm:FormGroup;
  public loading:Loading;
  public registeredUserProfiles: FirebaseListObservable<any>;

  constructor(public nav: NavController, public authData: AuthProvider, 
    public formBuilder: FormBuilder, public loadingCtrl: LoadingController, 
    public alertCtrl: AlertController, public af: AngularFireDatabase) {

    this.signupForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])],
      phone: ['', Validators.compose([Validators.required, Validators.pattern('^[\+0-9]{10,12}$')])],
      confirmPassword: ['', Validators.compose([Validators.required]), this.matchingPasswords('password', 'confirmPassword')]
    });
    this.registeredUserProfiles = af.list('/registeredUsers');
   
  }

  signupUser(){
    
    if(this.signupForm.valid){
      this.loading = this.loadingCtrl.create({
          dismissOnPageChange: true,
        });
      this.loading.present();

      this.authData.signupUser(this.signupForm.value.email, this.signupForm.value.password)
      .then((success) => {
        
        this.loading.dismiss().then( () => {
          var successMessage: string = "User added successfully";
          var alert = this.alertCtrl.create({
              message: successMessage,
              buttons: [
                {
                  text: "Ok",
                  role: 'cancel'
                }
              ]
            });
          alert.present();
          this.registeredUserProfiles.push({
            email: this.signupForm.value.email,
            phone: this.signupForm.value.phone,
            uid: success.uid
          });
          this.nav.setRoot(HomePage); //ReviewView issue
        });
        
        
      }, (error) => {
        this.loading.dismiss().then( () => {
          var errorMessage: string = error.message;
          var alert = this.alertCtrl.create({
              message: errorMessage,
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

  matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
    // TODO maybe use this https://github.com/yuyang041060120/ng2-validation#notequalto-1
    (group: FormGroup): {[key: string]: any} => {
      let password = group.root['controls'][passwordKey];
      let confirmPassword = group.root['controls'][confirmPasswordKey];

      return password.value === confirmPassword.value ? null : { notValid: true };
    }
  }

  
}