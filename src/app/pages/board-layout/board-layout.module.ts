import { MemberDetailsModalPageModule } from './../member-details-modal/member-details-modal.module';
import { MemberModalPageModule } from './../member-modal/member-modal.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BoardLayoutPageRoutingModule } from './board-layout-routing.module';

import { BoardLayoutPage } from './board-layout.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BoardLayoutPageRoutingModule,
    MemberModalPageModule,
    MemberDetailsModalPageModule
  ],
  declarations: [BoardLayoutPage]
})
export class BoardLayoutPageModule {}
