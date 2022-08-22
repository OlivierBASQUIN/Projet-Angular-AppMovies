/* 
    Pour créer nos modeles de données côté front, on peut utiliser:
    > les interface: permet le typage 
    > les class : permet le typage ET instancier un objet
*/
// export interface MovieModel {
//   id:number;
//   titre:string;
//   description: string;
//   image: string;
//   score: number;
//   date: Date;
// }

export class MovieModel {
    id:number;
    titre:string;
    description: string;
    image: string;
    image_portrait:string;
    score: number;
    date: Date;

    constructor(movieFromApi:any) {
        this.id = movieFromApi.id;
        this.titre = movieFromApi.title;
        this.description = movieFromApi.overview;
        this.image = movieFromApi.backdrop_path;
        this.image_portrait = movieFromApi.poster_path;
        this.score = movieFromApi.vote_average;
        this.date = movieFromApi.release_date;
    }
}

