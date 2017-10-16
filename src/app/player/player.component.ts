import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Http, Response, RequestOptions, Headers, Request, RequestMethod } from '@angular/http';
import { InfoService } from '../info.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Location } from '@angular/common';

let headers = null;
let options = null;


@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})

export class PlayerComponent implements OnInit {

  players: Array<any>;
  game: Array<any>;
  playByPlay: Array<any>;
  playerId: string = '';
  teamAtBat: string = '';
  currentPitcher: string = '';
  currentPitchResult: string = '';
  currentPitcherArm: string = '';
  currentPitchSpeed: string = '';
  selectedPlayer: Observable<any>;
  gameId: Observable<any>;
  defineToken: string = '';
  

  constructor(private route: ActivatedRoute, private infoService: InfoService, public router: Router, public location: Location, private http: Http) {}

  ngOnInit() {
    this.playerId = this.route.params['_value'].id;
    console.log(this.infoService.getSentStats(), 'getSentStats....');
    this.players = this.infoService.getSentStats();

    for (let player of this.players) { 
       if (player.player.ID === this.playerId) {
         console.log(player, 'this is the selected player');
         this.selectedPlayer = player;
         this.gameId = player.team.gameId;

       }
    }

      this.infoService.getEnv().subscribe(res => {
        this.defineToken = res._body;
        headers = new Headers({ "Authorization": "Basic " + btoa('ianposton' + ":" + this.defineToken) });
        options = new RequestOptions({ headers: headers });
        this.loadData();
      })
      
  
    
  }
 
 loadData(){
   let url6 = 'https://api.mysportsfeeds.com/v1.1/pull/mlb/2017-playoff/game_playbyplay.json?gameid='+this.gameId;
      console.log('getting play-by-play for this game from API...');
      this.http.get(url6, options)
        .map(response => response.json())
        .subscribe(res => {
        console.log(res['gameplaybyplay'].atBats.atBat, 'got response for play by play...');
        this.game = res['gameplaybyplay'].game;
        this.playByPlay = res['gameplaybyplay'].atBats.atBat;
        this.getPlays();
        });

         
          
 }

 getPlays() {
    if (this.players && this.playByPlay) {
            console.log('start sorting data for scoreboard stats...');
            for (let pbp of this.playByPlay) {
              for (let pdata of this.players) {
                if (this.game['awayTeam'].Abbreviation === pdata.team.Abbreviation) {
                  //get score for home and away
                  //console.log(pbp, 'play by play items');
                 if (pbp.inning === pdata.team.currentInning && pbp.inningHalf ===  pdata.team.currentInningHalf) {
                   //whats happening with pbp?
                   console.log(pbp, 'current inning');
                   this.teamAtBat = pbp.battingTeam.City + " " + pbp.battingTeam.Name;

                   pbp.atBatPlay.forEach((item, index) => {
                     console.log(item, 'at bat plays for away team');
                     if(item.pitch != null) {
                       this.currentPitcher = item.pitch.pitchingPlayer.FirstName + ' ' + item.pitch.pitchingPlayer.LastName;
                       this.currentPitchResult = item.pitch.result;
                       this.currentPitcherArm = item.pitch.throwingLeftOrRight;
                       this.currentPitchSpeed = item.pitch.ballStartSpeed;
                     }
                   })
                 }
                  
                }
                if (this.game['homeTeam'].Abbreviation === pdata.team.Abbreviation) {
                    if (pbp.inning === pdata.team.currentInning && pbp.inningHalf ===  pdata.team.currentInningHalf) {
                   //whats happening with pbp?
                   console.log(pbp, 'current inning');
                   this.teamAtBat = pbp.battingTeam.City + " " + pbp.battingTeam.Name;

                   pbp.atBatPlay.forEach((item, index) => {
                     console.log(item, 'at bat plays for home team');
                     if(item.pitch != null) {
                       this.currentPitcher = item.pitch.pitchingPlayer.FirstName + ' ' + item.pitch.pitchingPlayer.LastName;
                       this.currentPitchResult = item.pitch.result;
                       this.currentPitcherArm = item.pitch.throwingLeftOrRight;
                       this.currentPitchSpeed = item.pitch.ballStartSpeed;
                     }
                   })
                 }
                  
                 }

                }
              }
            }
 }
  

  public goBack() {
    this.router.navigateByUrl('/pitching-stats');
  }

}
