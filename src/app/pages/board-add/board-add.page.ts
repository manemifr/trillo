import { BoardColorSelectPage } from './../board-color-select/board-color-select.page';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-board-add',
  templateUrl: './board-add.page.html',
  styleUrls: ['./board-add.page.scss'],
})
export class BoardAddPage implements OnInit {

  board={
    name: '',
    bg: '#0081CA'
  };
  boardColorSelect= BoardColorSelectPage;
  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  async create(){
    this.modalCtrl.dismiss({board:this.board});
  }

  handleColorChange(selectedColor){
    this.board.bg =selectedColor;
  }

  close(){
    this.modalCtrl.dismiss();
  }

}
