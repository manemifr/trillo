import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MemberDetailsModalPageRoutingModule } from './member-details-modal-routing.module';

import { MemberDetailsModalPage } from './member-details-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MemberDetailsModalPageRoutingModule
  ],
  declarations: [MemberDetailsModalPage]
})
export class MemberDetailsModalPageModule {}
