import { MemberDetailsModalPage } from './../member-details-modal/member-details-modal.page';
import { MemberModalPage } from './../member-modal/member-modal.page';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonRouterOutlet, ModalController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { Board, BoardService } from 'src/app/services/board.service';
import { BoardSettingsPage } from '../board-settings/board-settings.page';

@Component({
  selector: 'app-board-layout',
  templateUrl: './board-layout.page.html',
  styleUrls: ['./board-layout.page.scss'],
})
export class BoardLayoutPage implements OnInit {

  members = [];
  board: Board = null;
  isAdmin = false;
  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    private boardService: BoardService,
    private modalCtrl: ModalController,
    private routerOutlet: IonRouterOutlet,
    private navCtrl: NavController
  ) { }
  ngOnInit() {
    this.route.data.subscribe((data: {board: Board}) =>{
      this.board = data.board;
      this.isAdmin = this.auth.getUserId() === this.board.creator;
      this.loadMembers();
    });
  }

  loadMembers(){
    this.members = [];
    this.boardService.getBoardMembers(this.board.id).subscribe(members =>{
      this.members = members;
    });
  }

  async openBoardSettings(){
    const modal = await this.modalCtrl.create({
      component: BoardSettingsPage,
      presentingElement: this.routerOutlet.nativeEl,
      swipeToClose: true,
      componentProps: {
        board: this.board
      },
    });
    await modal.present();

    modal.onDidDismiss().then((res: any) =>{
      if(res.data && res.data.remove){
        this.boardService.closeBoard(this.board.id).then(() =>{
          this.navCtrl.pop();
        });
      }
    });
  }

  async inviteUsers(){
    const modal = await this.modalCtrl.create({
      component: MemberModalPage,
      presentingElement: this.routerOutlet.nativeEl,
      swipeToClose: true,
      componentProps: {
        members: this.members
      },
    });
    await modal.present();

    modal.onDidDismiss().then((res: any) =>{
      if (res.data && res.data.add){
        // eslint-disable-next-line @typescript-eslint/no-shadow
        this.boardService.addUserToBoard(res.data.add, this.board.id).then((res) =>{
          this.loadMembers();
        });
      }
    });
  }

  async openMemberDetails(member){
    // eslint-disable-next-line prefer-const
    let memberIsAdmin = member.uid === this.board.creator;

    const modal = await this.modalCtrl.create({
      component: MemberDetailsModalPage,
      presentingElement: this.routerOutlet.nativeEl,
      swipeToClose: true,
      componentProps: {
        member,
        isAdmin: this.isAdmin,
        memberIsAdmin
      },
    });
    await modal.present();

    modal.onDidDismiss().then((res: any) =>{
      if(res.data && res.data.remove){
        console.log(res);
        this.boardService
          .removeUserFromBoard(member.uid,this.board.id)
          .then(()=>{
            if(member.uid === this.auth.getUserId()){
              this.navCtrl.pop();
            } else {
              this.loadMembers();
            }
          });
      }
    });

  }

}
