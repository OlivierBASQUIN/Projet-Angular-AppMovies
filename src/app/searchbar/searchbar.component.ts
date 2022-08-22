import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { MovieModel } from '../shared/models/movie.model';
import { MovieService } from '../shared/services/movie.service';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss'],
})
export class SearchbarComponent implements OnInit {
  foundMovies:MovieModel[] = [];
  subscription:Subscription = new Subscription()


  constructor(public movieSvc:MovieService) { 
    console.log(this)
    
  }

  ngOnInit(): void {
    // écouter foundMovies$
    this.subscription = this.movieSvc.foundMovies$.subscribe(
         data =>  {
           console.log('data : ',data)
           this.foundMovies = data
          }
    )  
  }
  /**
   * 
   * @param searchString 
   * si moins de 3 caractères on ne déclenche pas la request
   * si >= 3 caracteres, on appelle searchMoviesFromApi
   * 
   * si 0 caractères dans le champ de recherche
   */
  searchMoviesAction(searchString: string) {
    console.log(searchString);
    if(searchString.trim().length==0) {
      this.foundMovies = [];
    }
    else {
      if(searchString.trim().length>=3) {
        // faire la request
        this.movieSvc.searchMoviesFromApi(searchString);
      }
      else {
        this.foundMovies = [];
      }
    }
  }


  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

}
