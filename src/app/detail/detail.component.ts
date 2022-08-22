import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { MovieModel } from '../shared/models/movie.model';
import { MovieService } from '../shared/services/movie.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  movieId:number = 0
  movieVideo:any;
  // movie:any; 

  subscriptions:Subscription[] = [] ;
  constructor(
    private activatedRoute:ActivatedRoute, 
    public movieSvc:MovieService,
    private sanitizer: DomSanitizer
    ) { 

    }

  ngOnInit(): void {
    this.getVideoUrl('123')
    console.log(this.activatedRoute.snapshot.params); // renvoie un objet des paramètres nommés de l'url {id:1234}
    
    // 1 Récupérer l'ID de la vidéo dans l'URL
    this.movieId = this.activatedRoute.snapshot.params['id'];

    // 2 Faire la request pour récuperer la listes des videos B.A 
    /*
      Ici, on consomme directement le retour de movieSvc.getVideosOfMovie()
      à l'aide de la méthode .subscribe( response => doWhatYouWantWhenResponseWillArrive :) )
      car nous avons juste besoin de faire une request HTTP à l'API TMDB

      Si nous avions besoin d'écouter un changement ultérieur,
      il serait préférable de mettre en place un Subject() côté service
    */
    this.subscriptions.push(this.movieSvc.getVideosOfMovie(this.movieId).subscribe( 
        response => {
          this.movieVideo = response.results.find( (el:any) =>  el.site == 'YouTube') 
          console.log(this.movieVideo); 
        }
      )
    ) 

    this.subscriptions.push(this.movieSvc.movie$.subscribe( 
        (data:MovieModel) => { 
          if(data == undefined  || data == null || data.id != this.movieId) {
            this.movieSvc.getMovieFromApi(this.movieId);
          }
        } 
      )
    )

    console.log(this.movieSvc.movie$)

  } // Fin ngOnInit

  getVideoUrl(videoKey:string) {
    let url =  'https://www.youtube.com/embed/'+videoKey;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url)
  }

  /* 
    ngOnDestroy() fait partie de méthodes du cycle de vie du component
    Elle est exécutée par Angular "juste avant" la destruction du Component

    C'est ici qu'il faut unsubscribe nos subcriptions

  */ 
  ngOnDestroy() {
    for(let sub of this.subscriptions) {
      sub.unsubscribe()
    }
  }

}
