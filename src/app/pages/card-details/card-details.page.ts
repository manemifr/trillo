import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Browser } from '@capacitor/browser';
import { Camera, CameraSource, CameraResultType } from '@capacitor/camera';
import { ModalController, AlertController, ActionSheetController } from '@ionic/angular';
import { format, parseISO } from 'date-fns';
import { Board, BoardService } from 'src/app/services/board.service';

@Component({
  selector: 'app-card-details',
  templateUrl: './card-details.page.html',
  styleUrls: ['./card-details.page.scss'],
})
export class CardDetailsPage implements OnInit {
  @ViewChild('fileInput', {static:false}) fileInput: ElementRef;
  card: any;
  members = [];
  cardId = null;
  board: Board;

  //Checklist stuff
  newChecklistItem = '';
  showChecklist= false;

  constructor(
    private boardService: BoardService,
     private modalCtrl: ModalController,
      private alertCtrl: AlertController,
      private actionSheetCtrl: ActionSheetController) {
   }

  ngOnInit() {
    this.boardService.getCard(this.cardId).subscribe((card) =>{
      this.card = card;
      this.loadMembers();
    });
  }

  loadMembers() {
    this.members = [];
    this.boardService.getBoardMembers(this.board.id).subscribe(res =>{
      this.members = res;
    });
  }


  close(){
    this.modalCtrl.dismiss();
  }

async delete(){
    const alert = await this.alertCtrl.create({
      header: 'Confirmer Suppression',
      message: 'Cette opération est irréversible',
      buttons: [
        {
          role: 'cancel',
          text: 'Annuler',
        },
        {
          text: 'Supprimer',
          handler: ()=>{
            this.boardService.deleteCard(this.cardId).then((res) =>{
              this.modalCtrl.dismiss();
            });
          },
        },
      ],
    });

    await alert.present();
  }

  updateCard(action){
    this.boardService.updateCard(this.cardId, this.card, action);
  }

  addChecklistItem() {
    const newItem = {
      name: this.newChecklistItem,
      index: this.card.checklist.length,
      checked: false,
    };
    this.boardService.addChecklistItem(this.cardId, newItem).then((res) => {
      this.card.checklist.push(newItem);
      this.newChecklistItem = '';
    });
  }

  deleteChecklist(e) {
    // Don't trigger the surrounding button event
    e.stopPropagation();
    this.boardService.deleteChecklist(this.cardId).then((_) => {
      this.card.checklist = [];
    });
  }

  checklistItemChanged() {
    this.boardService.updateChecklist(this.cardId, this.card.checklist);
  }

  deleteChecklistItem(index) {
    const splicedItem = this.card.checklist.splice(index, 1);
    this.boardService.removeChecklistItem(this.cardId, splicedItem[0]);
  }

  async addAttachment(){
    const actionSheet = await this.actionSheetCtrl.create({
      cssClass: 'custom-action-sheet',
      header: 'Ajouter fichier',
      buttons: [{
        text:'Choisir un fichier',
        icon:'attach',
        handler: () =>{
          this.fileInput.nativeElement.click();
        }
      },
    {
      text: 'Prendre Photo',
      icon: 'camera',
      handler: () =>{
        this.addImage(CameraSource.Camera);
      }
    },
  {
    text:'Choisir à partir de Photos',
    icon:'image',
    handler: ()=> {
      this.addImage(CameraSource.Photos);
    }
  }]
    });
    await actionSheet.present();
  }

  fileSelected(event){
    const file = event.target.files[0];
    const type = file.type === 'image/jpeg' ? 'image' : 'file';
    this.boardService.uploadFile(this.cardId, file, type).subscribe(
      attachment => {
        this.card.attachments.push(attachment);
      }
    );
  }

  async addImage(source: CameraSource) {
   const image = await Camera.getPhoto({
     quality: 90,
     allowEditing: true,
     resultType: CameraResultType.Base64,
     source
   });

   this.boardService.uploadFile(this.cardId, image, 'image').subscribe( attachment =>{
     this.card.attachments.push(attachment);
   });
  }

  async openFile(attach){
    await Browser.open({url: attach.fileUrl});
  }


}
