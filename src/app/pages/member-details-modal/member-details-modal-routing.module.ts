import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MemberDetailsModalPage } from './member-details-modal.page';

const routes: Routes = [
  {
    path: '',
    component: MemberDetailsModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MemberDetailsModalPageRoutingModule {}
