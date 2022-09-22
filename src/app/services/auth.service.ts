import { Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import { AngularFirestore , AngularFirestoreDocument} from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import { GoogleAuth} from '@codetrix-studio/capacitor-google-auth';
import { AlertController } from '@ionic/angular';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import{switchMap} from 'rxjs/operators';
import { of,from } from 'rxjs';



export interface User{
  uid: string;
  email: string;
  photoURL?: string;
  displayName?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private alertController: AlertController,
    private storage: AngularFireStorage) { }

  //Firebase register process
  async emailSignup({email,password,fullname}): Promise<any> {
    const credential = await this.afAuth.createUserWithEmailAndPassword(
      email,
      password
    );
    return this.updateUserData(credential.user, fullname);
  }

  async googleSignup(){
    await GoogleAuth.init();
    const googleUser = await GoogleAuth.signIn();

    const credential = firebase.auth.GoogleAuthProvider.credential(
      googleUser.authentication.idToken
    );

    const afUser = await this.afAuth.signInWithCredential(credential);
    return this.updateUserData(
      afUser.user,
      googleUser.givenName,
      googleUser.imageUrl
    );
  }

  signIn({email,password}){

    return this.afAuth.signInWithEmailAndPassword(email,password);
  }

  resetPw(email){
    return this.afAuth.sendPasswordResetEmail(email);
  }

  //User functions
  getUserId(){
    return firebase.auth().currentUser.uid;
  }

  getUserData(){
    return this.afs.doc<User>(`users/${this.getUserId()}`).valueChanges();
  }

  uploadAvatar(base64String){
    //Create a path using the user UID
    const filePath =`${this.getUserId()}/avatar`;
    //Create an AngularFire reference for that path
    const fileRef = this.storage.ref(filePath);
    const task: AngularFireUploadTask = fileRef.putString(
      base64String,
      'base64',
      {contentType: 'image/png'}
    );

    return from(task).pipe(
      switchMap(result => fileRef.getDownloadURL()),
      switchMap(photoURL =>{
        //Set the url to the user document
        const uploadPromise = this.afs
          .doc(`users/${this.getUserId()}`)
          .set({photoURL},{merge:true});
        return from(uploadPromise);
      })
    );
  }

  //User Notififications
  getUserNotifications(){
    return this.afs
      .collection('notifications', (ref) =>
        ref
          .where('user', '==', this.getUserId())
          .orderBy('createdAt')
          )
          .valueChanges({idField: 'id'});
  }

  markNotificationRead(id){
    return this.afs.doc(`notifications/${id}`).update({read: true});
  }

  removeNotification(id){
    return this.afs.doc(`notifications/${id}`).delete();
  }

  //Sets user data to firestore on login
  private updateUserData(user: User, name = null, image = null): Promise<any> {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);
    const data = {
      uid: user.uid,
      email: user.email,
      displayName: name,
      photoURL: image,
    };
    return userRef.set(data,{merge:true});
  }



}
