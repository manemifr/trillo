import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BoardsPage } from './boards.page';

const routes: Routes = [
  {
    path: '',
    component: BoardsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BoardsPageRoutingModule {}
