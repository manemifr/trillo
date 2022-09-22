import { LoadingController } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { BoardService } from '../services/board.service';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { from, Observable } from 'rxjs';
import { finalize, switchMap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BoardResolverService implements Resolve<any> {

  constructor(
    private boardService: BoardService,
    private loadingCtrl: LoadingController) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    // eslint-disable-next-line prefer-const
    let id = route.paramMap.get('id');
    let loading: HTMLIonLoadingElement;

    const loadingProm = this.loadingCtrl.create({
      message: 'Preapring your board..',
    });

    return from(loadingProm).pipe(
      switchMap((loadingElem) => {
        loading = loadingElem;
        return from(loading.present());
      }),
      // eslint-disable-next-line arrow-body-style
      switchMap(() => {
        return this.boardService.getBoard(id);
      }),
      take(1),
      finalize(() => {
      this.loadingCtrl.dismiss();
    })
    );
  }}
