import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MemberModalPage } from './member-modal.page';

const routes: Routes = [
  {
    path: '',
    component: MemberModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MemberModalPageRoutingModule {}
