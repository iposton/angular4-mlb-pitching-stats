import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ActivatedRouteSnapshot } from '@angular/router';
import { InfoService } from '../info.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Location } from '@angular/common';


@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})

export class PlayerComponent implements OnInit {

  players: Array<any>;
  playerId: string = '';
  selectedPlayer: Observable<any>;
  

  constructor(private route: ActivatedRoute, private infoService: InfoService, public router: Router, public location: Location) {}

  ngOnInit() {
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

  public goBack() {
    this.router.navigateByUrl('/pitching-stats');
  }

}
