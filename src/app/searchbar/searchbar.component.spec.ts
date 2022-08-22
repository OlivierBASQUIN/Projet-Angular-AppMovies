import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { AppRoutingModule } from '../app-routing.module';
import { MovieModel } from '../shared/models/movie.model';
import { MovieService } from '../shared/services/movie.service';

import { SearchbarComponent } from './searchbar.component';

/**
   * 
   * TEST 1
   * 
   * si 0 caractères dans le champ de recherche
   * Attendu : componentInstance.foundMovies = []
   */

describe('SearchbarComponent', () => {
  let component: SearchbarComponent;
  let fixture: ComponentFixture<SearchbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchbarComponent ],
      providers: [{provide: MovieService, useClass:MockMovieService} ],
      imports: [AppRoutingModule],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    // component n'est pas null ni undefined
  });
  
  /**
   * 
   * TEST 1
   * 
   * si 0 caractères dans le champ de recherche de la vue HTML
   * Attendu : componentInstance.foundMovies = []
   */
  it('should foundMovies=[] if userInput string=0 chars', () => { 
    // on simule l'envoi d'un event sur le champ de recherche
    component.searchMoviesAction('');
    // on attend que foundMovies soit vide
    expect(component.foundMovies).toEqual([]);
  })
  //it()

    /**
   * 
   * TEST 2
   * 
   * si 3 caractères ou plus dans le champ de recherche de la vue HTML
   * Attendu : 
   *  > on execute la reuqete HTTP, 
   *  > foundMovies contient les résultats Tableau de MobvieModel
   */
  it('should not request if userInput<3 chars', () => { 
     // on simule l'envoi d'un event sur le champ de recherche
     component.searchMoviesAction('ba');
     expect(component.foundMovies).toEqual([])
  })

  it('should foundMovies is an array of MovieModel if userInput>=3 chars', () => {
     // on simule l'envoi d'un event sur le champ de recherche
     component.searchMoviesAction('bat');
     expect(component.foundMovies).toEqual([{
      id: 1,
      titre: 'batman', 
      date: new Date('2022-01-01'),
      image_portrait: 'imgP.jpg', 
      description: 'synopsis1', 
      score: 3,
      image: 'image1.jpg'
    }])
    expect(component.foundMovies).toHaveSize(1)

  });
});


class MockMovieService {

  movies:MovieModel[]  = [
     {
      id: 1,
      titre: 'batman', 
      date: new Date('2022-01-01'),
      image_portrait: 'imgP.jpg', 
      description: 'synopsis1', 
      score: 3,
      image: 'image1.jpg'
    },
    {
      id: 2,
      titre: 'Robin', 
      date: new Date('2022-02-01'),
      image_portrait: 'imgP2.jpg', 
      description: 'synopsis2', 
      score: 4, 
      image: 'image4.jpg'
    },
    {
      id: 3,
      titre: 'Superman', 
      date: new Date('2022-02-01'),
      image_portrait: 'imgP3.jpg', 
      description: 'synopsis3', 
      score: 1, 
      image: 'image3.jpg'
    },
   ];

   private _foundMovies$:BehaviorSubject<MovieModel[]> = new BehaviorSubject<MovieModel[]>(this.movies)

   private _movies$:Observable<MovieModel[]> = new Observable()

  searchMoviesFromApi(searchString: string) {
      let filteredMovies:MovieModel[] = this.movies.filter(m => m.titre.includes(searchString));
      console.log('filterdMovies', filteredMovies);
      this._foundMovies$.next(filteredMovies);
  }
  

  get foundMovies$():Observable<MovieModel[]> {
    return this._foundMovies$;
  }

}
