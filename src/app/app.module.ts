import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';


import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { AuthProvider } from '../providers/auth/auth';
import { HomePage } from '../pages/home/home';
import { GooglePlus } from '@ionic-native/google-plus';
import { Facebook } from '@ionic-native/facebook'


// Importing AF2 Module

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';

// AF2 Settings
// const firebaseConfig2 = {

//     apiKey: "AIzaSyBrJuCOihScJhi1AYqbGLydMRiOZkyq1VI",
//     authDomain: "demoapp-4ea42.firebaseapp.com",
//     databaseURL: "https://demoapp-4ea42.firebaseio.com",
//     projectId: "demoapp-4ea42",
//     storageBucket: "demoapp-4ea42.appspot.com",
//     messagingSenderId: "680611620102"
// };

const firebaseConfig = {
  apiKey: "AIzaSyCNJRN9IPYIpSQpOUjewiT5XdTWhzcq4Hk",
    authDomain: "testappfirebase-80777.firebaseapp.com",
    databaseURL: "https://testappfirebase-80777.firebaseio.com",
    projectId: "testappfirebase-80777",
    storageBucket: "testappfirebase-80777.appspot.com",
    messagingSenderId: "1019366618900"
};
@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    SplashScreen,
    StatusBar, 
    AuthProvider,
    GooglePlus,
    Facebook
  ]
})
export class AppModule {}
