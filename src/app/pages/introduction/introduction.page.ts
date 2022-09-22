import { SignupPage } from './../signup/signup.page';
import { Component, OnInit } from '@angular/core';
import { Browser } from '@capacitor/browser';
import { ActionSheetController, IonRouterOutlet, ModalController } from '@ionic/angular';
import { Device } from '@capacitor/device';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { ModalBaseComponent } from 'src/app/components/modal-base/modal-base.component';
import { LoginPage } from '../login/login.page';

@Component({
  selector: 'app-introduction',
  templateUrl: './introduction.page.html',
  styleUrls: ['./introduction.page.scss'],
})
export class IntroductionPage implements OnInit {

  constructor(
    private modalCtrl: ModalController,
    private routerOutlet: IonRouterOutlet,
    private actionSheetCrtl: ActionSheetController,
    private auth: AuthService,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  async openEmailSignup() {
    const modal = await this.modalCtrl.create({
      component: SignupPage,
      presentingElement: this.routerOutlet.nativeEl,
      swipeToClose: true,
    });
    await modal.present();
  }

  async openSignup(){
    const buttons = [
      {
        text: 'Sign up with email',
        icon: 'mail',
        handler: () => {
          this.openEmailSignup();
        },
      },
      {
        text: 'Sign up with Google',
        icon: 'logo-google',
        handler: () => {
          this.openGoogleSignup();
        },
      }];

      const device = await Device.getInfo();
      if(device.platform ==='ios'){
        buttons.push({
          text:'Sign in with Apple',
          icon:'logo-apple',
          handler: ()=> {
            this.openAppleSignup();
          },

        });
      }

      const actionSheet = await this.actionSheetCrtl.create({
        cssClass: 'custom-action-sheet',
        buttons
      });
      await actionSheet.present();
  }
  openAppleSignup() {
    throw new Error('Method not implemented.');
  }
  openGoogleSignup() {
    this.auth.googleSignup().then((res) =>{
      this.router.navigateByUrl('/app');
    }, err =>{
      //Canceld the sign up
    });
  }

  async openTerms(e) {
    e.preventDefault();
    await Browser.open({url: 'https://devdactic.com/imprint/'});
  }

  async openPrivacy(e) {
    e.preventDefault();
    await Browser.open({url: 'https://devdactic.com/privacy-policy/'});
  }

  async openLogin(){
    const modal = await this.modalCtrl.create({
      component: ModalBaseComponent,
      presentingElement: this.routerOutlet.nativeEl,
      swipeToClose: true,
      componentProps: {
        rootPage: LoginPage,
      },
    });
    await modal.present();

  }

}
