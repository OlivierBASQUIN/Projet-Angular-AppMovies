/*
  Ce service a été généré à l'aide de la commande :
  >  ng generate service services/movie
*/
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MovieModel } from '../models/movie.model';

@Injectable({
  providedIn: 'root'
})
// Le service expose des propriétés et méthodes
// qui peuvent être consommées par tous les component 
export class MovieService {

  private _currentPage:number = 1
  private _TMDB_API_URL = environment.apiTmdb;
  private _TMDB_APIKEY = environment.apikey_tmdb;
  /*
    les subjects et behaviorSubjects sont des Observable particuliers
    - on peut s'abonner à cette source via la méthode .subscribe()
    - on peut pousser une nouvelle donnée via la methode .next(value)
  */
 
  /* 
    Un subject est un Observable particulier sur lequel : 
    > on peut subscribe()
    > on peut next() 

    BehaviorSubject : au moment où on subscribe, on récupere la dernière valeur
    à l'instanciation il oblige à passer une valeur 

    Subject : au moment où on subscribe, la methode ne peut récuperer 
              que la PROCHAINE valeur

  */
  private _movies$ = new BehaviorSubject<MovieModel[]>([])
  private _movie$ = new BehaviorSubject<MovieModel>(null!);
  private _foundMovies$ = new BehaviorSubject<MovieModel[]>([]);

  constructor(private http:HttpClient ) { }
  /*
     rôle : request api theMovieDB pour rechercher des films
     endpoint : /search/movie
     queryString : api_key, language, query
  */
  searchMoviesFromApi(searchString:string):void {
    if(searchString.trim().length>0) {
      // faire la requête 
      let endPoint = '/search/movie';
      // let queryString = '?api_key='+this._TMDB_APIKEY+'&language=fr&query='+searchString;
      
      let params = new HttpParams()
      .set('api_key', this._TMDB_APIKEY)
      .set('language', 'fr')
      .set('query', searchString);
      console.log(params)
  
      this.http.get(this._TMDB_API_URL+endPoint, {params} )
       // mapper la reponse en tabeau de MovieModel 
      .pipe( 
        map( (apiResponse:any) => apiResponse.results.map( 
          (movie: any) => new MovieModel(movie) ) 
        )
      )
      .subscribe( (data:MovieModel[]) => 
      this._foundMovies$.next(data))
      // assigner la réponse en valeur de _foundMovies$ avec .next()
    }
    else {
      this._foundMovies$.next([]);
    }
  }

  /* 
    rôle : getter de _movies$
    return un Observable 
    Nos components peuvent consommer : 
    > this.movieSvc.movies$.subscribe()
  */
  get movies$():Observable<MovieModel[]> {
    return this._movies$.asObservable();
    // on retourne un Observable
    // nous ne souhaitons pas exposer directement 
    // le subject et sa méthode de modification (.next())
  }

  set movies$(movies:any) {
    this._movies$.next(movies)
  }

  public getVideosOfMovie(movieId:number):Observable<any> {
    return this.http.get(this._TMDB_API_URL+'/movie/'+movieId+'/videos?api_key='+this._TMDB_APIKEY+'&language=fr')
  }

  /*
    > Faire une requete HTTP à l'API theMovieDB
    > ET charger en valeur de movies$, la réponse (le tableau d'objets movies)
  */
  public getMoviesFromApi():void {
     this.http.get(this._TMDB_API_URL+'/discover/movie?api_key='+this._TMDB_APIKEY+'&language=fr&page='+this._currentPage)
     .pipe( 
        // avec l'opérateur map de RxJS, 
        // on va mapper la reponse de l'API TMDB
        map( (apiResponse:any) => 
          apiResponse.results.map( (movie:any) => new MovieModel(movie))
        ) 
      ) // fin pipe() retourne un Observable
     .subscribe(
       (response:Array<MovieModel>) => {
         console.log(response)
         this._movies$.next(response)
        }
     )
  }

  public getMovieFromApi(movieId:number) {
    this.http.get(this._TMDB_API_URL+'/movie/'+movieId+'?api_key='+this._TMDB_APIKEY+'&language=fr')
    .pipe( 
       // avec l'opérateur map de RxJS, 
       // on va mapper la reponse de l'API TMDB
       map( (apiResponse:any) => 
         new MovieModel(apiResponse)
       ) 
     ) // fin pipe() retourne un Observable
    .subscribe(
      (response:MovieModel) => {
        console.log(response)
        this._movie$.next(response)
       }
    )

  }
  
  /*
    > Faire une requete HTTP à l'API theMovieDB (sur la page suivant)
    > push dans le tableau de movies les 20 films suivants
    > ET charger en valeur de movies$, le tableau de movies
  */
  getNextMoviesFromApi():void {
   // 0 incrementer this.currentPage;
   this._currentPage += 1
   // 1 faire la request des 20 films suivants (page suivante)
   this.http.get(this._TMDB_API_URL+'/discover/movie?api_key='+this._TMDB_APIKEY+'&language=fr&page='+this._currentPage)
   // pipe : permet de transformer un Observable et retourne un Observable
   .pipe( 
      // avec l'opérateur map de RxJS, 
      // on va mapper la reponse de l'API TMDB
      map( (apiResponse:any) => 
        apiResponse.results.map( (movie:any) => new MovieModel(movie))
      ) 
    ) // fin pipe() retourne un Observable
   .subscribe( (response:Array<MovieModel>) => {
     // 2 construire le tableau de TOUS les films
     let allMovies = [...this._movies$.getValue(), ...response];
     // 3 pousser la nouvelle donnée (tous les films) dans _movies$ (.next())
     this._movies$.next(allMovies);
   })
  }

  setMovie(movie:MovieModel) {
    this._movie$.next(movie)
  }

  get movie$() {
    return this._movie$.asObservable()
  }

  resetFoundMovies$() {
    this._foundMovies$.next([])
  }

  get foundMovies$():Observable<MovieModel[]> {
    return this._foundMovies$.asObservable()
  }


  
}
