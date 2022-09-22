
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { combineLatest, forkJoin, from, Observable } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { timeStamp } from 'console';

export interface Board{
  name: string;
  bg: string;
  creator: string;
  members: any[];
  id: string ;
  desc?: string;
}

export interface BoardList{
  name: string;
  id?: string;
  board: string;
  cards?: Observable<any[]>;
}

@Injectable({
  providedIn: 'root',
})
export class BoardService {

  private boardCollection: AngularFirestoreCollection<Board>;
  constructor(
    private afs: AngularFirestore,
     private authService: AuthService,
     private storage: AngularFireStorage) {
    this.boardCollection = this.afs.collection('boards');
   }

   addBoard(board: Board){
     board.creator = this.authService.getUserId();
     board.members = [];
     board.desc = '';
     return this.boardCollection.add(board);
   }

    getBoards(){
     const userId = this.authService.getUserId();
     const ownBoards = this.afs
     .collection('boards',(ref) =>ref.where('creator', '==',userId))
     .valueChanges({idField:'id'});
     const memberBoards = this.afs
      .collection('boards',(ref) => ref.where('members', 'array-contains',userId))
      .valueChanges({idField:'id'});

    return combineLatest(ownBoards,memberBoards)
      .pipe(map(([s1, s2]) => [...s1, ...s2]));
   }

   getBoard(id){
     return this.boardCollection.doc(id).valueChanges().pipe(
       map((board: Board) =>{
        board.id = id;
        return board;
       })
     );
   }

   getUserPreviewData(userId){
     return this.afs.doc(`users/${userId}`).valueChanges().pipe(take(1));
   }

   getBoardMembers(id){
     return this.getBoard(id).pipe(
       take(1),
       switchMap((board: Board) => {
          const creatorObs = this.getUserPreviewData(board.creator);
          const memberObsArray = board.members.map((member) =>
            this.getUserPreviewData(member));
          return forkJoin([creatorObs, ...memberObsArray]);
       })
     );
   }

   updateBoard(boardId,name,desc){
     return this.boardCollection.doc(boardId).update({name,desc});
   }

   closeBoard(boardId){
     return this.boardCollection.doc(boardId).delete();
   }

   addUserToBoard(userId,boardId){
     return this.boardCollection.doc(boardId).update({
       members: firebase.firestore.FieldValue.arrayUnion(userId) as unknown as any[],
     });
   }

   removeUserFromBoard(userId,boardId){
     return this.boardCollection.doc(boardId).update({
       members: firebase.firestore.FieldValue.arrayRemove(userId) as unknown as any[],
     });
   }

   addList(board,name,position){
     return this.afs.collection('lists').add({name,position,board});
   }

   getBoardLists(id) {
    return this.afs
      .collection('lists', (ref) =>
        ref.where('board', '==', id).orderBy('position')
      )
      .valueChanges({ idField: 'id' })
      .pipe(
        map((lists: any) => {
          // eslint-disable-next-line prefer-const
          for (let list of lists) {
            list.cards = this.getCardList(list.id);
          }
          return lists;
        })
      ) as Observable<BoardList[]>;
  }

  addListCard(boardId, listId, name, index=0){
     const task = {
       name,
       createdAt: firebase.firestore.FieldValue.serverTimestamp(),
       creator: this.authService.getUserId(),
       list: listId,
       board: boardId,
       desc: '',
       index,
       checklist: [],
       attachments: []
     };

     return this.afs.collection('cards').add(task);
  }

  getCardList(listId) {
    return this.afs
      .collection('cards', (ref) => ref.where('list', '==',listId).orderBy('index'))
      .valueChanges({idField: 'id'});
  }

  getCardListLength(listId){
    return this.afs
      .collection('cards',(ref) =>
        ref.where('list', '==', listId).orderBy('index', 'desc').limit(1))
      .valueChanges()
      .pipe(take(1), map((cards: any) =>{
        console.log('cards: ', cards);
        if (cards.length > 0){
          return cards[0].index;
        } else {
          return 0;
        }
      }));
  }

  updateCardPositionInList(cardId, index){
    return this.afs.collection('cards').doc(cardId).update({index});
  }

  getCard(cardId){
    return this.afs.doc(`cards/${cardId}`).valueChanges().pipe(take(1));
  }

  deleteCard(cardId){
    return this.afs.collection('cards').doc(cardId).delete();
  }

  updateCard(cardId, card, action){
    card.lastEdit = this.authService.getUserId();
    card.lastAction = action;
    return this.afs.collection('cards').doc(cardId).update(card);
  }

  // Checklist

  updateChecklist(cardId, checklist) {
    return this.afs.doc(`cards/${cardId}`).update({
      checklist,
      lastEdit: this.authService.getUserId(),
      lastAction: 'Checklist',
    });
  }

  addChecklistItem(cardId, checklistItem) {
    return this.afs.doc(`cards/${cardId}`).update({
      checklist: firebase.firestore.FieldValue.arrayUnion(checklistItem),
      lastEdit: this.authService.getUserId(),
      lastAction: 'Checklist',
    });
  }

  removeChecklistItem(cardId, checklistItem) {
    return this.afs.doc(`cards/${cardId}`).update({
      checklist: firebase.firestore.FieldValue.arrayRemove(checklistItem),
    });
  }

  deleteChecklist(cardId) {
    return this.afs.doc(`cards/${cardId}`).set({ checklist: [] });
   }

   //Storage
   uploadFile(cardId,file,type){
     const name = file.name || new Date().toLocaleDateString();
     const randomId = `${new Date().getTime()}_${this.authService.getUserId()}`;
     const filePath = `${cardId}/${randomId}`;
     const fileRef = this.storage.ref(filePath);
     let task: AngularFireUploadTask;
     if(file.type){
       task = fileRef.put(file,{contentType: file.type});
     } else {
       task = fileRef.putString(file.base64String, 'base64', {contentType: 'image/jpeg'});
     }

     return from(task).pipe(
       switchMap(()=>fileRef.getDownloadURL()),
       switchMap(fileUrl => from(this.addAttachment(cardId,fileUrl,type, name)))
     );
   }

  private addAttachment(cardId, fileUrl, type, name = '') {
    const attachment = {
      type,
      fileUrl,
      name
    };

    return this.afs.doc(`cards/${cardId}`).update({
      attachments: firebase.firestore.FieldValue.arrayUnion(attachment),
      lastEdit: firebase.auth().currentUser.uid,
      lastAction: 'Attachment'
    }).then(_ => attachment);
  }
}
