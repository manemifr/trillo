import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BoardAddPage } from './board-add.page';

const routes: Routes = [
  {
    path: '',
    component: BoardAddPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BoardAddPageRoutingModule {}
