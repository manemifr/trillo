import { Component, OnInit } from '@angular/core';
import { IonNav } from '@ionic/angular';

@Component({
  selector: 'app-board-color-select',
  templateUrl: './board-color-select.page.html',
  styleUrls: ['./board-color-select.page.scss'],
})
export class BoardColorSelectPage implements OnInit {

  colors = [
    '#0081CA',
    '#519839',
    '#828B91',
    '#4CBF6B',
    '#D29034',
    '#CD5991',
    '#895F9E',
    '#AF4732',
    '#01AECC',
  ];

  selected='';
  callback: any;
  constructor(private nav: IonNav) { }

  ngOnInit() {
  }

  goBack(){
    if(this.callback){
      this.callback(this.selected);
    }
    this.nav.pop();
  }

}
