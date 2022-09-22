import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BoardColorSelectPageRoutingModule } from './board-color-select-routing.module';

import { BoardColorSelectPage } from './board-color-select.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BoardColorSelectPageRoutingModule
  ],
  declarations: [BoardColorSelectPage]
})
export class BoardColorSelectPageModule {}
