import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Board, BoardService } from 'src/app/services/board.service';

@Component({
  selector: 'app-board-settings',
  templateUrl: './board-settings.page.html',
  styleUrls: ['./board-settings.page.scss'],
})
export class BoardSettingsPage implements OnInit {
  board: Board;
  constructor(private modalCtrl: ModalController, private boardService: BoardService) { }

  ngOnInit() {
  }

  deleteBoard(){
    this.modalCtrl.dismiss({remove:true});
  }

  close(){
    this.boardService.updateBoard(this.board.id,this.board.name,this.board.desc).then(()=>{
      this.modalCtrl.dismiss();
    });
  }

}
