import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  registerForm: FormGroup;
  showDetails = false;
  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder,
    private auth: AuthService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private router: Router,

  ) { }

  ngOnInit() {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required,Validators.email]],
      password:['',[Validators.required, Validators.minLength(6)]],
      fullname: ['',Validators.required],
    });
  }
  continue(){
    this.showDetails = true;
  }
  async signUp(){
    const loading = await this.loadingController.create();
    await loading.present();
    this.auth
    .emailSignup(
      this.registerForm.value
    )
    .then(
      (res) =>{
        loading.dismiss();
        this.close();
        this.router.navigateByUrl('/app');
      },
      async (err) =>{
        loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Sign up failed',
          message: err.message,
          buttons: ['OK'],
        });
        await alert.present();
      }
    );
  }
  close(){
    this.modalCtrl.dismiss();
  }
}
