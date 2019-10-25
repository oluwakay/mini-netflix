import { LoadingIndicatorService } from './loadingIndicatorStatus';
import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';
import { IUser } from './IUser';
import { UserService } from './user.service';
import { AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  redirectUrl: string;
  user: IUser;

  constructor(
    private ngZone: NgZone,
    public afAuth: AngularFireAuth,
    private router: Router,
    public userService: UserService,
    private afs: AngularFirestore,
    private loadingIndicator: LoadingIndicatorService
  ) {
    this.checkLocalStorage();
  }

  get isLoggedIn(): boolean {
    return !!this.user;
  }
  /*
   * If localStoge is empty, we call getDataFromFirebase
   * method set user data from firebase on localStorage
   */
  checkLocalStorage() {
    if (!localStorage.getItem('user')) {
      this.getFirebaseData();
    } else {
      console.log('localStorage ready!');
    }
  }
  /*
   * Call data from firebase and set data on local storage
   */
  getFirebaseData() {
    this.loadingIndicator.isLoading = true;
    this.afAuth.authState.subscribe(auth => {
      if (auth) {
        this.user = auth; // save data firebase on user
        console.log('Authenticated: ', auth); // set user data from firebase on local storage
        this.loadingIndicator.isLoading = true;
      } else {
        console.log('Not authenticated');
        this.loadingIndicator.isLoading = false;
      }
    });
  }

  /*
   * login with google
   */
  loginWithGoogle() {

    this.loadingIndicator.isLoading = true;
    const provider = new firebase.auth.GoogleAuthProvider();
    this.afAuth.auth
      .signInWithPopup(provider)
      .then(data => {
        this.updateUserData(data.user);
      })
      .catch(error => {
        console.log(error);
        this.loadingIndicator.isLoading = false;
      });
  }
  /*
   * logout
   */
  logout() {
    this.userService.clearLocalStorage(); // Optional to clear localStorage
    this.afAuth.auth.signOut().then(() => {
      this.router.navigate(['login']);
    });
  }

  private updateUserData(user) {
    // Sets user data to firestore on login

    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);

    const data: IUser = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    };
    userRef.set(data, { merge: true });

    this.userService.setUserLoggedIn(data);

    this.loadingIndicator.isLoading = false;

    this.ngZone.run(() => this.router.navigate(['dashboard'])).then();

    return true;

  }
}
