import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import{canActivate,redirectUnauthorizedTo, redirectLoggedInTo} from '@angular/fire/compat/auth-guard';



//Envoyer les utilisateurs pas autorisés a la page login
const redirectUnauthorizedToLogin = () =>
  redirectUnauthorizedTo(['/introduction']);

const redirectLoggedInToApp = ()=> redirectLoggedInTo(['/app']);

const routes: Routes = [

  {
    path: '',
    redirectTo: 'introduction',
    pathMatch: 'full'
  },
  {
    path: 'introduction',
    ...canActivate(redirectLoggedInToApp),
    loadChildren: () => import('./pages/introduction/introduction.module').then( m => m.IntroductionPageModule)
  },
  {
    path: 'app',
    ...canActivate(redirectUnauthorizedToLogin),
    loadChildren: () => import('./pages/tabs/tabs.module').then( m => m.TabsPageModule)
  },
  {
    path: 'board-add',
    loadChildren: () => import('./pages/board-add/board-add.module').then( m => m.BoardAddPageModule)
  },
  {
    path: 'board-color-select',
    loadChildren: () => import('./pages/board-color-select/board-color-select.module').then( m => m.BoardColorSelectPageModule)
  },
  {
    path: 'board-settings',
    loadChildren: () => import('./pages/board-settings/board-settings.module').then( m => m.BoardSettingsPageModule)
  },
  {
    path: 'member-modal',
    loadChildren: () => import('./pages/member-modal/member-modal.module').then( m => m.MemberModalPageModule)
  },
  {
    path: 'member-details-modal',
    loadChildren: () => import('./pages/member-details-modal/member-details-modal.module').then( m => m.MemberDetailsModalPageModule)
  },
  {
    path: 'card-details',
    loadChildren: () => import('./pages/card-details/card-details.module').then( m => m.CardDetailsPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules , relativeLinkResolution:'legacy'})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
