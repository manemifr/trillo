import { FcmService } from './../../services/fcm.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  constructor( private fcmService: FcmService) { }

  ngOnInit() {
    this.fcmService.initPush();
  }

}
