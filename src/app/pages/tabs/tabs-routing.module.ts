import { LoadingController } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';
import { BoardResolverService } from 'src/app/resolver/board-resolver.service';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'boards',
        loadChildren: () =>
          import('../boards/boards.module').then(m => m.BoardsPageModule),
      },
      {
        path: 'search',
        loadChildren: () =>
          import('../search/search.module').then(m => m.SearchPageModule),
      },
      {
        path: 'notifications',
        loadChildren: () =>
          import('../notifications/notifications.module').then(m => m.NotificationsPageModule),
      },
      {
        path: 'account',
        loadChildren: () =>
          import('../account/account.module').then(m => m.AccountPageModule),
      },
      {
        path: '',
        redirectTo: 'boards',
        pathMatch: 'full',
      },
    ]
  },
  {
    path:'boards/:id',
    resolve:{
      board: BoardResolverService
    },
    loadChildren: ()=>
      import('../board-layout/board-layout.module').then(
        (m) => m.BoardLayoutPageModule
      )
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
