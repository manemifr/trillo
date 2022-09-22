import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MemberModalPageRoutingModule } from './member-modal-routing.module';

import { MemberModalPage } from './member-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MemberModalPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [MemberModalPage]
})
export class MemberModalPageModule {}
