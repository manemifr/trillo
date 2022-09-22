import { environment } from './../../../environments/environment';
import { Component, OnInit } from '@angular/core';
import algoliasearch from 'algoliasearch/lite';

const client = algoliasearch(environment.algolia.app, environment.algolia.key);
const index = client.initIndex('cards');

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  cards = [];

  constructor() { }

  ngOnInit() {
  }

  searchFor(event){
    const search = event.detail.value;
    if(search === ''){
      this.cards = [];
    } else {
      const filter = {
        facets: ['name', 'desc'],
      };

      index
        .search(search, filter)
        .then(({hits}) =>{
          this.cards = hits as [];
        })
        .catch((err) =>{
          console.log(err);
        });
    }
  }

}
