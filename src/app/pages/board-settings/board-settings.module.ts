import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BoardSettingsPageRoutingModule } from './board-settings-routing.module';

import { BoardSettingsPage } from './board-settings.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BoardSettingsPageRoutingModule
  ],
  declarations: [BoardSettingsPage]
})
export class BoardSettingsPageModule {}
