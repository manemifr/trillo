import { ResetPwPage } from './../reset-pw/reset-pw.page';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  showPw = false;
  resetPwPage = ResetPwPage;
  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder,
    private auth: AuthService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private router: Router
  ) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['',[Validators.required,Validators.email]],
      password: ['',Validators.required]
    });
  }

  async signIn(){
    const loading = await this.loadingController.create();
    await loading.present();
    this.auth
    .signIn(this.loginForm.value)
    .then(
      (res) =>{
        loading.dismiss();
        this.close();
        this.router.navigateByUrl('/app');
      },
      async (err) =>{
        loading.dismiss();
        const alert = await this.alertController.create({
          header: ':(',
          message: err.message,
          buttons:['OK'],
        });
        await alert.present();
      }
    );
  }
  close() {
    this.modalCtrl.dismiss();
  }

  openGoogleSignup(){
    this.auth.googleSignup().then((res) =>{
      this.close();
      this.router.navigateByUrl('/app');
    }, err =>{
      //Canceled the sign up
    });
  }

}
