import { SharedPipesModule } from './../pipes/shared-pipes.module';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalBaseComponent } from './modal-base/modal-base.component';
import { TaskCardComponent } from './task-card/task-card.component';



@NgModule({
  declarations: [ModalBaseComponent,TaskCardComponent],
  imports: [
    CommonModule,
    IonicModule,
    SharedPipesModule
  ],
  exports: [ModalBaseComponent, TaskCardComponent],
})
export class SharedComponentsModule { }
