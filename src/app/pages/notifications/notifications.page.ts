import { CardDetailsPage } from './../card-details/card-details.page';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { PushNotifications } from '@capacitor/push-notifications';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {
  notifications: Observable<any>;
  constructor(private auth: AuthService, private modalCtrl: ModalController) { }

  ngOnInit() {
    this.notifications = this.auth.getUserNotifications();
  }

  async openCard(notification) {
    this.auth.markNotificationRead(notification.id);
    notification.read = true;
    const modal = await this.modalCtrl.create({
      component: CardDetailsPage,
      swipeToClose: false,
      componentProps: {
        cardId : notification.cardId,
      },
    });
    modal.present();
  }

  removeNotifications(){
    this.auth.getUserNotifications()
      .pipe(take(1))
      .subscribe((res) =>{
        for (const notification of res) {
          this.auth.removeNotification(notification.id);
        }
        PushNotifications.removeAllDeliveredNotifications();
      });
  }

}
