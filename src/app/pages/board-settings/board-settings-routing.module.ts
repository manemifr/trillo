import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BoardSettingsPage } from './board-settings.page';

const routes: Routes = [
  {
    path: '',
    component: BoardSettingsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BoardSettingsPageRoutingModule {}
