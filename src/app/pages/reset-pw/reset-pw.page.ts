import { Component, OnInit } from '@angular/core';
import { AlertController, IonNav, LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-reset-pw',
  templateUrl: './reset-pw.page.html',
  styleUrls: ['./reset-pw.page.scss'],
})
export class ResetPwPage implements OnInit {
  email = '';
  constructor(
    private auth: AuthService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private nav: IonNav
  ) { }

  ngOnInit() {
  }

  async sendResetEmail(){
    const loading = await this.loadingController.create();
    await loading.present();

    this.auth.resetPw(this.email).then(
      async res =>{
        loading.dismiss();
        const alert = await this.alertController.create({
          header:'Success',
          message:'Un mail de récupération vous a été envoyé',
          buttons: [
            {
              text: 'OK',
              handler: ()=> {
                this.nav.pop();
              }
            }
          ]
        });
        await alert.present();
      },
      async err =>{
        loading.dismiss();
        const alert = await this.alertController.create({
          header: ':(',
          message: err.message,
          buttons: ['OK']
        });
        await alert.present();
      }
    );
  }

}
