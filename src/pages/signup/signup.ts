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
      phone: ['', Validators.compose([Validators.required, Validators.pattern('^[\+0-9]{10,12}$')])]
    });
    this.registeredUserProfiles = af.list('/registeredUsers');
   
  }

  /**
   * If the form is valid it will call the AuthData service to sign the user up password displaying a loading
   *  component while the user waits.
   *
   * If the form is invalid it will just log the form value, feel free to handle that as you like.
   */
  signupUser(){
    if (!this.signupForm.valid){
      console.log(this.signupForm.value);
    } else {
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
}