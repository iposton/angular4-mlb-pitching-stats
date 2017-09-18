import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActivatedRouteSnapshot } from '@angular/router';
import { InfoService } from '../info.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';


@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})

//let playerId = '';

export class PlayerComponent implements OnInit {

  players: Array<any> ;
  playerId: string = '';
  selectedPlayer: Observable<any> ;
  

  constructor(private route: ActivatedRoute, private infoService: InfoService) {}



  ngOnInit() {
    //console.log(this.route.params['_value'].id, 'get player by id from statData');
    // const player = route.snapshot.data;
    // console.log(player, 'player passed in route');
    this.playerId = this.route.params['_value'].id;
    console.log(this.infoService.getSentStats(), 'getSentStats....');
    this.players = this.infoService.getSentStats();

    for (let player of this.players) { 
       if (player.player.ID === this.playerId) {
         console.log(player, 'this is the selected player');
         this.selectedPlayer = player;

       }
    }



    
  }

}
