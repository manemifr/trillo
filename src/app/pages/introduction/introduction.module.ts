import { LoginPageModule } from './../login/login.module';
import { SharedComponentsModule } from './../../components/shared-components.module';
import { SignupPageModule } from './../signup/signup.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IntroductionPageRoutingModule } from './introduction-routing.module';

import { IntroductionPage } from './introduction.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IntroductionPageRoutingModule,
    SignupPageModule,
    SharedComponentsModule,
    LoginPageModule
  ],
  declarations: [IntroductionPage]
})
export class IntroductionPageModule {}
