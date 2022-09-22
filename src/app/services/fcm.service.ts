import { CardDetailsPage } from './../pages/card-details/card-details.page';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Capacitor } from '@capacitor/core';
import { ActionPerformed, PushNotifications, PushNotificationSchema, Token } from '@capacitor/push-notifications';
import { ModalController } from '@ionic/angular';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FcmService {

  constructor(
    private afs: AngularFirestore,
    private auth: AuthService,
    private modalCtrl: ModalController

  ) { }

  initPush(){
    if (Capacitor.getPlatform() !== 'web'){
      this.registerPush();
    }
  }

  private registerPush() {
    PushNotifications.requestPermissions().then((result) =>{
      if(result.receive === 'granted') {
        //Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        //Show some error
      }
    });

    PushNotifications.addListener(
      'registration',
      (token: Token) =>{
        console.log(token.value);
        this.saveToken(token.value);
      }

    );

    PushNotifications.addListener('registrationError', (error: any) =>{
      console.log('Error on registration: ' + JSON.stringify(error));
    });

    PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotificationSchema) =>{
        console.log('Push received: ' + JSON.stringify(notification));
      }
    );

    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      async (notification: ActionPerformed) =>{
        const data = notification.notification.data;
        const cardId = data.cardId;
        const modal = await this.modalCtrl.create({
          component: CardDetailsPage,
          swipeToClose: false,
          componentProps: {
            cardId,
          },

        });
        modal.present();
      }
    );
  }

  private saveToken(token) {
    if(!token){
      return;
    }

    const devicesRef = this.afs.collection('devices');
    const userId = this.auth.getUserId();

    const data = {
      token,
      userId,
    };

    return devicesRef.doc(userId).set(data);
  }
}
