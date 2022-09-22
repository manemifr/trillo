
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BoardPageRoutingModule } from './board-routing.module';

import { BoardPage } from './board.page';
import { CardDetailsPageModule } from './../card-details/card-details.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BoardPageRoutingModule,
    CardDetailsPageModule
  ],
  declarations: [BoardPage]
})
export class BoardPageModule {}
