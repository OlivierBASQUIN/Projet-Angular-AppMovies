import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-stars',
  templateUrl: './stars.component.html',
  styleUrls: ['./stars.component.scss']
})
export class StarsComponent implements OnInit {

  @Input() score:any;
  @Input() total:any;
  scoreArray:number[]= [];

  constructor() { }

  ngOnInit(): void {
    let newScore = Math.round(this.score/ (this.total/5) );
    // Creer un tableau 
    this.scoreArray = new Array(newScore).fill(1)
    
  }

}
