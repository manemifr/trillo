import { CardDetailsPage } from './../card-details/card-details.page';
import { forkJoin } from 'rxjs';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { IonSlides, MenuController, ModalController } from '@ionic/angular';
import { Board, BoardList, BoardService } from 'src/app/services/board.service';
import { take } from 'rxjs/operators';
import {arrayMoveImmutable} from 'array-move';

@Component({
  selector: 'app-board',
  templateUrl: './board.page.html',
  styleUrls: ['./board.page.scss'],
})
export class BoardPage implements OnInit {
  @ViewChild(IonSlides) slides: IonSlides;
  board: Board = null;

  // Editing Lists
  boardLists: BoardList[] = [];
  isCreatingList = false;
  newListName= '';

  slideOptsZoomed = {
    slidesPerView: 1.2,
    spaceBetween: 15,
    centeredSlides: true,
    freeMode: false,
    slidesOffsetBefore: 0
  };

  slideOptsUnzoomed = {
    slidesPerView: 1.9,
    spaceBetween: 15,
    centeredSlides: false,
    freeMode: false,
    slidesOffsetBefore: 15
  };

  slideOpts = this.slideOptsUnzoomed;

  isZoomed = false;

  newListCard = '';
  newListCardFields = {};


constructor(private route: ActivatedRoute,
    private menuCtrl: MenuController,
    public sanitizer: DomSanitizer,
    private boardService: BoardService,
    private modalCtrl: ModalController) { }

  ngOnInit() {
    this.route.data.subscribe((data: {board: Board}) =>{
      this.board = data.board;
      // eslint-disable-next-line @typescript-eslint/no-shadow
      this.boardService.getBoardLists(this.board.id).subscribe((data) =>{
        this.boardLists = data;
      });
    });
  }

  toggleBoardDetails(){
    this.menuCtrl.toggle('boardMenu');
  }

  getStatusbarColor(){
    return this.shadeColor(this.board.bg, -30);
  }

  editNewList(show){
    this.zoom(show);
    this.isCreatingList = show;
    setTimeout(()=>{
      this.slides.slideTo(this.boardLists.length, 300);
    });
  }
  zoom(forceZoom?) {
    this.isZoomed = forceZoom ? true : !this.isZoomed;
    this.slideOpts = this.isZoomed ? this.slideOptsZoomed : this.slideOptsUnzoomed;
  }

  async saveList(){
    const position = (await this.slides.length()) - 1;

    this.boardService
      .addList(this.board.id,this.newListName,position)
      .then(() =>{
        this.isCreatingList = false;
        this.newListName = '';
      });
  }

  addListCard(index){
    const listId = this.boardLists[index].id;
    this.boardService.getCardListLength(listId).subscribe((maxIndex: number) =>{
      const cardIndex = maxIndex + 1;
      this.boardService.addListCard(this.board.id,listId, this.newListCard, cardIndex);
      this.newListCard = '';
      this.editListCards(0, false);
    });
  }

  editListCards(index, show) {
    // Close all input fields first
    for (const key of Object.keys(this.newListCardFields)) {
      this.newListCardFields[key] = false;
    }

    //Open or close the selected field
    this.newListCardFields[index] = show;
  }

  async openCardModal(card){
    const modal = await this.modalCtrl.create({
      component: CardDetailsPage,
      swipeToClose: false,
      componentProps: {
        cardId: card.id,
        board: this.board
      },
    });
    await modal.present();
  }

  // Drag and drop function
  doReorder(ev: any, listIndex: number){
    this.boardLists[listIndex].cards.pipe(take(1)).subscribe((cards: any) =>{
      // Finish the reorder and position the item in the DOM
      ev.detail.complete();

      const newOrderCards: any[] = arrayMoveImmutable(cards, ev.detail.from, ev.detail.to);
      const observables = [];

      for (const [index, card] of newOrderCards.entries()){
        // The index is now the position in the array
        const obs = this.boardService.updateCardPositionInList(card.id, index);
        observables.push(obs);
      }
      forkJoin(observables).pipe(take(1)).subscribe();
    });
  }


  private shadeColor(color,percent) {
    let R = parseInt(color.substring(1,3),16);
    // eslint-disable-next-line prefer-const
    let G = parseInt(color.substring(3,5),16);
    // eslint-disable-next-line prefer-const
    let B = parseInt(color.substring(5,7),16);

    // eslint-disable-next-line radix
    R = parseInt('' + (R*(100+percent))/100);
    // eslint-disable-next-line radix
    G= parseInt('' + (R*(100+percent))/100);
    // eslint-disable-next-line radix
    B= parseInt('' + (R*(100+percent))/100);

    R = R <255 ? R : 255;
    G = G <255 ? G: 255;
    B = B <255 ? B : 255;

    // eslint-disable-next-line prefer-const
    let RR = R.toString(16).length === 1 ? '0' + R.toString(16) : R.toString(16);
    // eslint-disable-next-line prefer-const
    let GG = G.toString(16).length === 1 ? '0' + G.toString(16) : G.toString(16);
    // eslint-disable-next-line prefer-const
    let BB = R.toString(16).length === 1 ? '0' + B.toString(16) : B.toString(16);
    return '#'+ RR+ GG + BB;
  }



}
