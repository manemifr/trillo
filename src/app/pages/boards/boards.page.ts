
import { BoardAddPage } from './../board-add/board-add.page';
import { Component, OnInit } from '@angular/core';
import { IonRouterOutlet, ModalController } from '@ionic/angular';
import { ModalBaseComponent } from 'src/app/components/modal-base/modal-base.component';
import { Observable } from 'rxjs';
import { BoardService } from 'src/app/services/board.service';

@Component({
  selector: 'app-boards',
  templateUrl: './boards.page.html',
  styleUrls: ['./boards.page.scss'],
})
export class BoardsPage implements OnInit {
  boards: Observable<any> = new Observable<any>();
  constructor(
    private modalCtrl: ModalController,
    private routerOutlet: IonRouterOutlet,
    private boardService: BoardService
  ) { }

  ngOnInit() {
    this.boards = this.boardService.getBoards();
  }

  async add(){
    const modal = await this.modalCtrl.create({
      component:ModalBaseComponent,
      presentingElement:this.routerOutlet.nativeEl,
      swipeToClose:true,
      componentProps:{
        rootPage:BoardAddPage,
      },
    });

    modal.onDidDismiss().then((res: any)=>{
      if(res.data && res.data.board){
       this.boardService.addBoard(res.data.board);
      }
    });

    await modal.present();
  }

}
