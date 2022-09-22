import { CardDetailsPage } from './../../pages/card-details/card-details.page';
import { BoardService } from 'src/app/services/board.service';
import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss'],
})
export class TaskCardComponent implements OnInit {

  @Input() card: any;
  avatar = null;
  constructor(
    private modalCtrl: ModalController,
    private boardService: BoardService
  ) { }

  ngOnInit() {
    if(this.card.assigneee){
      this.boardService
        .getUserPreviewData(this.card.assignee)
        .subscribe((data: any) =>{
          this.avatar = data.photoURL;
        });
    }
  }

  async openCard(){
    const cardId = this.card.id || this.card.objectID;
    this.boardService.getBoard(this.card.board).subscribe(async (board) =>{
      const modal = await this.modalCtrl.create({
        component: CardDetailsPage,
        swipeToClose: false,
        componentProps: {
          cardId,
          board,
        },
      });
      modal.present();
    });
  }

}
