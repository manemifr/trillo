import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BoardColorSelectPage } from './board-color-select.page';

const routes: Routes = [
  {
    path: '',
    component: BoardColorSelectPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BoardColorSelectPageRoutingModule {}
