import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(public auth: AngularFireAuth, private router: Router) {}

  async signUp(email: string, password: string) {
    return  this.auth.createUserWithEmailAndPassword(email, password);
  }
  async loginGoogle() {
    return  this.auth.signInWithPopup(
      new firebase.default.auth.GoogleAuthProvider()
    );
  }

  async SignInEmailPassword(email: string, password: string) {
    return   this.auth.signInWithEmailAndPassword(email, password)

  }
  async logout() {
    return  this.auth.signOut();
  }
}
