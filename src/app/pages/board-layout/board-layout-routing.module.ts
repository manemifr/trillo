import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BoardLayoutPage } from './board-layout.page';

const routes: Routes = [
  {
    path: '',
    component: BoardLayoutPage,
    children:[
      {
        path: '',
        loadChildren: ()=>
          import('../board/board.module').then((m) => m.BoardPageModule)
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BoardLayoutPageRoutingModule {}
