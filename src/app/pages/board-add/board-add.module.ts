import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BoardAddPageRoutingModule } from './board-add-routing.module';

import { BoardAddPage } from './board-add.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BoardAddPageRoutingModule
  ],
  declarations: [BoardAddPage]
})
export class BoardAddPageModule {}
