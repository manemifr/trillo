import { environment } from './../../../environments/environment';
import { Component, OnInit } from '@angular/core';
import algoliasearch from 'algoliasearch/lite';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';

const client = algoliasearch(environment.algolia.app,environment.algolia.key);
const index = client.initIndex('users');
@Component({
  selector: 'app-member-modal',
  templateUrl: './member-modal.page.html',
  styleUrls: ['./member-modal.page.scss'],
})
export class MemberModalPage implements OnInit {
  search: FormGroup;
  users = [];
  members = [];
  constructor(private modalCtrl: ModalController, private fb: FormBuilder) { }

  ngOnInit() {
    this.search = this.fb.group({
      value: ''
    });

    this.search.valueChanges.subscribe((res) =>{
      if (res.value !==''){
        this.searchFor(res.value);
      } else {
        this.users = [];
      }
    });
  }

  searchFor(value) {
    index
      .search(value)
      .then(({hits}) =>{
        // eslint-disable-next-line prefer-const
        for (let hit of hits){
          // eslint-disable-next-line prefer-const
          let shouldAdd = true;
          // eslint-disable-next-line prefer-const
          for(let mem of this.members){
            if(hit.objectID === mem.uid){
              //Object is already member of the board
              shouldAdd = false;
            }
          }
          if(shouldAdd){
            this.users.push(hit);
          }
        }
      })
      .catch((err) =>{
        console.log(err);
      });
  }

  addUser(user){
    this.modalCtrl.dismiss({add: user.objectID});
  }

  close(){
    this.modalCtrl.dismiss();
  }

}
