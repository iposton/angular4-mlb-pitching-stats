import { Component, ViewChild, Inject, OnInit } from '@angular/core';
import { MdDialog } from '@angular/material';
import { MdDialogRef } from "@angular/material";
import { MD_DIALOG_DATA } from '@angular/material';
import { DataSource } from '@angular/cdk';
import { MdPaginator } from '@angular/material';
import { MdSort } from '@angular/material';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { InfoService } from '../info.service';
import { FirebaseService } from '../firebase.service';
import { Http, Response, RequestOptions, Headers, Request, RequestMethod } from '@angular/http';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/publishReplay';
import 'rxjs/add/observable/forkJoin';

let headers = null;
let options = null;

export interface Data {}

@Component({
  selector: 'app-pitching-stats',
  templateUrl: './pitching-stats.component.html',
  styleUrls: ['./pitching-stats.component.css']
})
export class PitchingStatsComponent implements OnInit {

  title = 'app';
  players: Array<any> ;
  myData: Array < any > ;
  playerInfo: Array < any > ;
  statData: Array < any > ;
  dailyStats: Array < any > ;
  dailySchedule: Array < any > ;
  fastballData: Array < any > ;
  gameIdData: Array < any > ;
  starterIdData: Array < any > = [];
  specificFastballData: Array < any > = [];
  specificFastballDataById: Array < any > = [];
  speedResults: Array < any > = [];
  loading: boolean = true;
  live: boolean = false;

  stat: string = '';
  defineToken: string = '';
  displayedColumns = [
    'id',
    'pitches',
    'strikeouts',
    'pitcherWalks',
    'inningsPitched',
    'pitchesPerInning',
    'pitcherWildPitches',
    'pickoffAttempts'
  ];
  dataSource: MyDataSource;

  pitcherspeed: { pitcher: string, pitchspeedStart: string, lastName: string };
  
  @ViewChild(MdSort) sort: MdSort;

  constructor(public dialog: MdDialog, private infoService: InfoService, private firebaseService: FirebaseService, private http: Http) {this.players = this.infoService.getSentStats();}

  loadEnv() {
    
    this.infoService
      .getEnv().subscribe(res => {
        this.defineToken = res._body;
        headers = new Headers({ "Authorization": "Basic " + btoa('ianposton' + ":" + this.defineToken) });
        options = new RequestOptions({ headers: headers });
        this.infoService
          .sendHeaderOptions(headers, options);
        //this.loadData(this.defineToken);

        //// let headers = new Headers({ "Authorization": "Basic " + btoa('ianposton' + ":" + this.defineToken) });
        // let options = new RequestOptions({ headers: headers });

        //THESE FUNCTIONS WORK TOGETHER TO MAKE MULTIPLE API CALLS AND PUSH IT ALL TO FIREBASE
        // this.infoService
        //   .getGameId(this.defineToken).subscribe(res => {
        //     console.log(res, 'gameID data!');
        //     //THIS CHUNK MAKES MULTIPLE API CALLS AND SAVES LARGE CHUNKS OF DATA TO FIREBASE
        //     Observable.forkJoin(
        //       res['fullgameschedule'].gameentry.map(
        //         g =>
        //         this.http.get('https://api.mysportsfeeds.com/v1.1/pull/mlb/2017-regular/game_playbyplay.json?gameid=' + g.id + '&status=final', options)
        //         .map(response => response.json())
        //       )
        //     ).subscribe(res => {
        //       let i;
        //       let i2;
        //       res.forEach((item, index) => {
        //         i = index;
        //         console.log(res[i]['gameplaybyplay'], 'got game data!');


        //   res[i]['gameplaybyplay'].atBats.atBat.forEach((item2, index) => {
        //     i2 = index;
        //     //console.log(item2.atBatPlay, 'atbatplay items...');
        //     item2.atBatPlay.forEach((item3, index) => {
        //       let f = item3;

        //       if (f.pitch != undefined && f.pitch.ballStartSpeed != undefined) {
        //         //console.log(f.pitch);
        //         this.pitcherspeed = {
        //           pitcher: f.pitch.pitchingPlayer.ID,
        //           pitchspeedStart: f.pitch.ballStartSpeed,
        //           lastName: f.pitch.pitchingPlayer.LastName,
        //         }
        //         this.specificFastballData.push(this.pitcherspeed);

        //       }

        //     })


        //   })

        //   this.speedResults = this.specificFastballData.reduce(function(r, a) {
        //     r[a.pitcher] = r[a.pitcher] || [];
        //     r[a.pitcher].push(a);
        //     return r
        //   }, Object.create(null));
        //   console.log('made groups of pichers pitch speeds by ID...');



        //       });


        //     });
        //          this.loadData(this.defineToken);
        //   });

      this.infoService
        .getDailySchedule().subscribe(res => {
         
          console.log(res, "schedule...");
          this.dailySchedule = res['dailygameschedule'].gameentry;

          Observable.forkJoin(
              res['dailygameschedule'].gameentry.map(
                g =>
                this.http.get('https://api.mysportsfeeds.com/v1.1/pull/mlb/2017-regular/game_startinglineup.json?gameid=' + g.id + '&position=P', options)
                .map(response => response.json())
              )
            )
            .subscribe(res => {
              console.log(res, 'making several calls by GAME ID for starting lineups...');

              let i;
              let i2;
              let res2;
              res.forEach((item, index) => {
                i = index;
                //console.log(res[i]['gamestartinglineup'].teamLineup, 'got starting lineups data!');
                res2 = res[i]['gamestartinglineup'].teamLineup
                res2.forEach((item, index) => {
                  i2 = index;
                  if (res2[i2].expected === null) {
                    console.log(res2[i2], 'starter is NULL in here. ERROR.');
                  } else {
                    //console.log(res2[i2].expected.starter[0].player.ID, 'got player ID!');
                    this.starterIdData.push(res2[i2].expected.starter[0].player.ID);
                    //console.log(this.starterIdData, 'this array has ALL the IDs of todays starters');
                  }

                });
              });

            });
            this.loadData();
        })


      })

    this.firebaseService
      .getFastballData()
      .subscribe(x => {
        console.log(x, 'got response from firebase...');
        //this.loadData();
        this.fastballData = x;
      });
  }

  loadData() {

    this.infoService
      .getDaily().subscribe(res => {
        console.log(res, "Daily stats...");
        this.dailyStats = res['dailyplayerstats'].playerstatsentry;
      })

    
    this.infoService
      .getInfo().subscribe(res => {
        console.log(res, 'got player info res from cache I think!');
        this.playerInfo = res['activeplayers'].playerentry;
      });

    //THESE FUNCTIONS GET PLAYER INFO AND CREATE CUSTOM PLAYER VALUES BARROWED FROM SEPARATE API CALL

    this.infoService
      .getStats().subscribe(res => {
        console.log(res, 'got res!');

        this.myData = res['cumulativeplayerstats'].playerstatsentry;

        if (this.starterIdData.length > 0) {

          if (this.myData && this.starterIdData) {
            console.log('start sorting data for starters...');
            for (let startid of this.starterIdData) {

              for (let startdata of this.myData) {

                if (startid === startdata.player.ID) {
                  startdata.player.startingToday = true;
                }

              }
            }

          }

          if (this.myData && this.fastballData) {
            console.log('start sorting players for pitch speeds from firebase...');
            for (let fastballspeed of this.fastballData) {
              for (let speeddata of this.myData) {
                if (fastballspeed.ID === speeddata.player.ID) {
                  speeddata.player.pitchSpeedAvg = fastballspeed.pitchSpeedAvg;
                }

              }
            }

          }

          if (this.myData && this.dailySchedule) {

            console.log('start sorting data for daily schedule...');
            for (let schedule of this.dailySchedule) {

              for (let sdata of this.myData) {

                if (schedule.awayTeam.Name === sdata.team.Name) {
                  sdata.team.opponent = schedule.homeTeam.City + ' ' + schedule.homeTeam.Name;
                  //console.log(sdata, 'opponent home team...');
                }
                if (schedule.homeTeam.Name === sdata.team.Name) {
                  sdata.team.opponent = schedule.awayTeam.City + ' ' + schedule.awayTeam.Name;
                  //console.log(sdata, 'opponent away team...');
                }
              }
            }

          }

          if (this.myData && this.dailyStats) {
            console.log('start sorting data for daily stats...');
            for (let daily of this.dailyStats) {
              for (let mdata of this.myData) {
                if (daily.player.ID === mdata.player.ID) {
                  mdata.player.playingToday = true;
                  mdata.player.winToday = daily.stats.Wins['#text'];
                  mdata.player.loseToday = daily.stats.Losses['#text'];
                  mdata.player.saveToday = daily.stats.Saves['#text'];
                  mdata.player.inningsToday = daily.stats.InningsPitched['#text'];
                  mdata.player.earnedrunsToday = daily.stats.EarnedRunsAllowed['#text'];
                  mdata.player.strikeoutsToday = daily.stats.PitcherStrikeouts['#text'];
                  mdata.player.hitsallowedToday = daily.stats.HitsAllowed['#text'];
                  mdata.player.pitchesthrownToday = daily.stats.PitchesThrown['#text'];

                }
              }
            }
          }

          if (this.myData && this.playerInfo) {
            console.log('start sorting data for pictures and other info about player...');
            for (let info of this.playerInfo) {
              for (let data of this.myData) {

                if (info.player.ID === data.player.ID) {
                  if (data.stats.Pitcher2SeamFastballs && data.stats.Pitcher4SeamFastballs && data.stats.PitcherChangeups && data.stats.PitcherCurveballs && data.stats.PitcherCutters && data.stats.PitcherSliders && data.stats.PitcherSinkers && data.stats.PitcherSplitters) {
                    data.player.favPitch = Math.max(parseInt(data.stats.Pitcher2SeamFastballs['#text'], 10), parseInt(data.stats.Pitcher4SeamFastballs['#text'], 10), parseInt(data.stats.PitcherChangeups['#text'], 10), parseInt(data.stats.PitcherCurveballs['#text'], 10), parseInt(data.stats.PitcherCutters['#text'], 10), parseInt(data.stats.PitcherSliders['#text'], 10), parseInt(data.stats.PitcherSinkers['#text'], 10), parseInt(data.stats.PitcherSplitters['#text'], 10));
                    data.player.favPitchPercent = Math.floor(data.player.favPitch / parseInt(data.stats.PitchesThrown['#text'], 10) * 100);
                  }
                  data.player.image = info.player.officialImageSrc;
                  data.player.age = info.player.Age;
                  data.player.city = info.player.BirthCity;
                  data.player.country = info.player.BirthCountry;
                  data.player.Height = info.player.Height;
                  data.player.Weight = info.player.Weight;
                  data.player.IsRookie = info.player.IsRookie;

                  //STAT-DATA IS CALLED IN THE HTML
                  this.statData = this.myData;

                  //This fills the table with data
                  this.dataSource = new MyDataSource(this.statData, this.sort);

                }

              }
            }

            this.infoService
              .sendStats(this.statData);

          }

        }

        //THIS FOR LOOP GETS AVG PITCH SPEED FOR EVERY PITCHER IN THIS LIST
        // this.myData.forEach((data) => {
        //   // this.firebaseService
        //   //     .addData(this.speedResults[data.player.ID]);
        //   data.player.latestPitchSpeeds = this.speedResults[data.player.ID];

        //   if (data.player.latestPitchSpeeds) {
        //     let avg = data.player.latestPitchSpeeds.reduce((r, a) => {

        //       return r + parseInt(a.pitchspeedStart);

        //     }, 0) / data.player.latestPitchSpeeds.length;

        //     data.player.pitchSpeedAvg = Math.floor(avg);
        //     this.firebaseService
        //       .addData(data.player);

        //   }

        // });

        this.loading = false;
      });


  }

  ngOnInit() {
    // IF ALL THE PITCHING DATA IS DEFINED DON'T RUN LOADENV()
    // WHICH CALLS THE API FOR DATA
    // ELSE GET THE DATA SAVED IN THE INFO SERVICE 
    // AVOID LONG RELOADING TIME
    if (this.players === undefined) {
      this.loadEnv();
    } else {

      //This fills the table with data
      this.dataSource = new MyDataSource(this.players, this.sort);

      setInterval (() => {
        this.loading = false;
      }, 0)

      for (let p of this.players) { 
        if (p.player.playingToday) {
          this.live = true;
        }
      }
      
    }  
  }

  public open(event, data) {
    console.log(data, 'ok you clicked on a table row....');
    this.dialog.open(MyDialog, {
      data: data,
      width: '600px',
    });


  }

  public isVisibleOnMobile() {
    // console.log('width under 600px');
  }

  public isVisibleOnDesktop() {
    // console.log('width over 600px');
  }

}

@Component({
  selector: 'my-dialog',
  template: `<md-dialog-content>
  <md-icon (click)="dialogRef.close()" style="float:right; cursor:pointer;">close</md-icon>
</md-dialog-content>
<md-grid-list cols="3" rowHeight="200px">
  <md-grid-tile [colspan]="1">
    <img src="{{ data.player.image }}">
  </md-grid-tile>
  <md-grid-tile [colspan]="2">
    <p>{{ data.player.FirstName + ' ' + data.player.LastName + ' (' + data.team.Name + ' - ' + data.player.Position + ')'}} <span *ngIf="data.player.IsRookie == 'true'" style="background:#2ecc71; color:#fff; padding:3px; border-radius:2px;">Rookie</span>
      <br> Age: {{data.player.age}} Height: {{data.player.Height}} Weight: {{data.player.Weight}}
      <br> Birth City: {{data.player.city +', '+ data.player.country}}
      <br> Number: {{data.player.JerseyNumber}}
      <br> Opponent: <span *ngIf="data.team.opponent;then content else other_content"></span> <ng-template #content>{{data.team.opponent}}</ng-template> <ng-template #other_content>No game today.</ng-template>
      <br><span *ngIf="data.player.startingToday" style="background:#d35400; color:#fff; padding:3px; border-radius:2px;">Starting in today's game. </span></p>
  </md-grid-tile>
</md-grid-list>
<md-grid-list cols="3" rowHeight="50px">
  <md-grid-tile [colspan]="1">
    <h1><b>W-L:</b> {{ data.stats.Wins['#text'] +'-'+ data.stats.Losses['#text'] }}</h1>
  </md-grid-tile>
  <md-grid-tile [colspan]="1">
    <h1><b>ERA:</b> {{ data.stats.EarnedRunAvg['#text'] }}</h1>
  </md-grid-tile>
  <md-grid-tile [colspan]="1">
    <h1><b>K's:</b> {{ data.stats.PitcherStrikeouts['#text'] }}</h1>
  </md-grid-tile>
</md-grid-list>
<div class="fav-pitch">
  <h2 *ngIf="data.player.favPitch == data.stats.Pitcher2SeamFastballs['#text']">Uses the 2-Seam Fastball {{data.player.favPitchPercent}}% of pitches thrown.</h2>
  <h2 *ngIf="data.player.favPitch == data.stats.Pitcher4SeamFastballs['#text']">Uses the 4-Seam Fastball {{data.player.favPitchPercent}}% of pitches thrown.</h2>
  <h2 *ngIf="data.player.favPitch == data.stats.PitcherChangeups['#text']">Uses the Changeup {{data.player.favPitchPercent}}% of pitches thrown.</h2>
  <h2 *ngIf="data.player.favPitch == data.stats.PitcherCurveballs['#text']">Uses the Curveball {{data.player.favPitchPercent}}% of pitches thrown.</h2>
  <h2 *ngIf="data.player.favPitch == data.stats.PitcherCutters['#text']">Uses the Cutter {{data.player.favPitchPercent}}% of pitches thrown.</h2>
  <h2 *ngIf="data.player.favPitch == data.stats.PitcherSliders['#text']">Uses the Slider {{data.player.favPitchPercent}}% of pitches thrown.</h2>
  <h2 *ngIf="data.player.favPitch == data.stats.PitcherSinkers['#text']">Uses the Sinker {{data.player.favPitchPercent}}% of pitches thrown.</h2>
  <h2 *ngIf="data.player.favPitch == data.stats.PitcherSplitters['#text']">Uses the Splitter {{data.player.favPitchPercent}}% of pitches thrown.</h2>
</div>
<div class="fav-pitch" *ngIf="data.player.pitchSpeedAvg">
  <h2>Avg pitch speed is {{data.player.pitchSpeedAvg}}mph</h2>
</div>
<div class="fav-pitch" *ngIf="data.player.winToday == '1'">
  <h2>{{ data.player.FirstName + ' ' + data.player.LastName}} got a Win today!</h2>
    <button md-button class="more-stats-btn" [routerLink]="['/daily-stats', data.player.ID]" (click)="dialogRef.close()">MORE STATS</button>
</div>
<div class="fav-pitch" *ngIf="data.player.loseToday == '1'">
  <h2>{{ data.player.FirstName + ' ' + data.player.LastName}} Lost today!</h2>
    <button md-button class="more-stats-btn" [routerLink]="['/daily-stats', data.player.ID]" (click)="dialogRef.close()">MORE STATS</button>
</div>
<div class="fav-pitch" *ngIf="data.player.saveToday == '1'">
  <h2>{{ data.player.FirstName + ' ' + data.player.LastName}} got a Save today!</h2>
    <button md-button class="more-stats-btn" [routerLink]="['/daily-stats', data.player.ID]" (click)="dialogRef.close()">MORE STATS</button>
</div>
<div class="fav-pitch" *ngIf="data.player.winToday == '0' && data.player.saveToday == '0' && data.player.loseToday == '0'">
  <h2>{{ data.player.FirstName + ' ' + data.player.LastName}} pitched  <div *ngIf="data.player.inningsToday === '1.0';then pt else other_pt"></div> <ng-template #pt>1 inning</ng-template> <ng-template #other_pt>{{data.player.inningsToday}} innings</ng-template>, {{data.player.strikeoutsToday}}  <div *ngIf="data.player.strikeoutsToday === '1';then k else other_k"></div> <ng-template #k>strikeout</ng-template> <ng-template #other_k>strikeouts</ng-template> and gave up {{data.player.earnedrunsToday}} <div *ngIf="data.player.earnedrunsToday === '1';then r else other_r"></div> <ng-template #r>run</ng-template> <ng-template #other_r>runs</ng-template> today!</h2>
  <button md-button class="more-stats-btn" [routerLink]="['/daily-stats', data.player.ID]" (click)="dialogRef.close()">MORE STATS</button>
</div>`,
})

export class MyDialog {
  constructor(public dialogRef: MdDialogRef < MyDialog > , @Inject(MD_DIALOG_DATA) public data: any) {}
}

export class MyDataSource extends DataSource < Data > {

  constructor(private datas: Data[], private sort: MdSort) {
    super();
  }



  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable < Data[] > {
    //return Observable.of(this.data);
    const displayDataChanges = [
      Observable.of(this.datas),
      this.sort.mdSortChange,
    ];

    return Observable.merge(...displayDataChanges).map(() => {
      return this.getSortedData();
    });
  }

  disconnect() {}

  /** Returns a sorted copy of the database data. */
  getSortedData(): Data[] {
    const data = this.datas.slice();
    if (!this.sort.active || this.sort.direction == '') { return data; }

    return data.sort((a, b) => {
      //console.log(a, 'a');
      //console.log(a, 'b');
      let propertyA: number | string = '';
      let propertyB: number | string = '';

      switch (this.sort.active) {

        case 'pitches':
          [propertyA, propertyB] = [a['stats'].PitchesThrown['#text'], b['stats'].PitchesThrown['#text']];
          break;
        case 'strikeouts':
          [propertyA, propertyB] = [a['stats'].PitcherStrikeouts['#text'], b['stats'].PitcherStrikeouts['#text']];
          break;
        case 'pitcherWalks':
          [propertyA, propertyB] = [a['stats'].PitcherWalks['#text'], b['stats'].PitcherWalks['#text']];
          break;
        case 'inningsPitched':
          [propertyA, propertyB] = [a['stats'].InningsPitched['#text'], b['stats'].InningsPitched['#text']];
          break;
        case 'pitchesPerInning':
          [propertyA, propertyB] = [a['stats'].PitchesPerInning['#text'], b['stats'].PitchesPerInning['#text']];
          break;
        case 'pitcherWildPitches':
          [propertyA, propertyB] = [a['stats'].PitcherWildPitches['#text'], b['stats'].PitcherWildPitches['#text']];
          break;
        case 'pickoffAttempts':
          [propertyA, propertyB] = [a['stats'].PickoffAttempts['#text'], b['stats'].PickoffAttempts['#text']];
          break;

      }

      let valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      let valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this.sort.direction == 'asc' ? 1 : -1);
    });
    
  }

}