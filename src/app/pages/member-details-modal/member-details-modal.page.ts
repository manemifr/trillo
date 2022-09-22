import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-member-details-modal',
  templateUrl: './member-details-modal.page.html',
  styleUrls: ['./member-details-modal.page.scss'],
})
export class MemberDetailsModalPage implements OnInit {
  member: any;
  isAdmin: boolean;
  isSelf = false;
  memberIsAdmin: boolean;
  constructor( private modalCtrl: ModalController, private auth: AuthService) { }

  ngOnInit() {
    this.isSelf = this.auth.getUserId() === this.member.uid;
  }

  remove(){
    this.modalCtrl.dismiss({remove:true});
  }

  close(){
    this.modalCtrl.dismiss();
  }

}
