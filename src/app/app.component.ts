import { Component, ViewChild, Inject } from '@angular/core';
import { FirebaseService } from './firebase.service';


export interface Data {}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

//   title = 'app';
//   myData: Array < any > ;
//   playerInfo: Array < any > ;
//   statData: Array < any > ;
//   dailyStats: Array < any > ;
//   fastballData: Array < any > ;
//   gameIdData: Array < any > ;
//   specificFastballData: Array < any > = [];
//   specificFastballDataById: Array < any > = [];
//   speedResults: Array < any > = [];
//   loading: boolean = true;

//   stat: string = '';
//   defineToken: string = '';
//   displayedColumns = [
//     'id',
//     'pitches',
//     'strikeouts',
//     'pitcherWalks',
//     'inningsPitched',
//     'pitchesPerInning',
//     'pitcherWildPitches',
//     'pickoffAttempts'
//   ];
//   dataSource: MyDataSource;

//   pitcherspeed: { pitcher: string, pitchspeedStart: string, pitchspeedEnd: string, lastName: string };
//   //@ViewChild(MdPaginator) paginator: MdPaginator;
//   @ViewChild(MdSort) sort: MdSort;

   constructor() {}
  
// loadEnv() {
//   this.infoService
//       .getEnv().subscribe(res => {
//         this.defineToken = res._body;
        
//       })

//          //THESE FUNCTIONS GET DATA FROM FIREBASE AND THEN GROUPS DATA BASED BY PLAYER ID       
//     this.firebaseService
//       .getFastballData()
//       .subscribe(x => {
//         console.log('got response from fb....');
//         this.loadData(this.defineToken);
//       this.fastballData = x;
//       for (let fb of this.fastballData) {
//         for (let f of fb.atBatPlay) {
//           if (f.pitch != undefined && f.pitch.ballStartSpeed != undefined) {
//             //console.log(f.pitch);
//             this.pitcherspeed = {
//               pitcher: f.pitch.pitchingPlayer.ID,
//               pitchspeedStart: f.pitch.ballStartSpeed,
//               pitchspeedEnd: f.pitch.ballEndSpeed,
//               lastName: f.pitch.pitchingPlayer.LastName,
//             }
//             this.specificFastballData.push(this.pitcherspeed);
//           }
//         }

//       }

//       this.speedResults = this.specificFastballData.reduce(function(r, a) {
//         r[a.pitcher] = r[a.pitcher] || [];
//         r[a.pitcher].push(a);
//         return r
//       }, Object.create(null));
//       console.log('made groups from fb data...');

//     });
//    }
  
//   loadData(token) {

//     this.infoService
//         .getDaily(token).subscribe(res => {
//          console.log(res, "Daily stats...");
//          this.dailyStats = res['dailyplayerstats'].playerstatsentry;
//       })

//     this.infoService
//       .getInfo(token).subscribe(res => {
//         console.log(res, 'got player info res from cache I think!');
//         this.playerInfo = res['activeplayers'].playerentry;
//       });

//     //THESE FUNCTIONS GET PLAYER INFO AND CREATE CUSTOM PLAYER VALUES BARROWED FROM SEPARATE API CALL

//     this.infoService
//       .getStats(token).subscribe(res => {
//         console.log(res, 'got res!');

//         this.myData = res['cumulativeplayerstats'].playerstatsentry;

//         if (this.myData && this.dailyStats) {
//           console.log('start sorting data for pictures and other info about player...');
//           for (let daily of this.dailyStats) {
//             for (let mdata of this.myData) {
//               if (daily.player.ID === mdata.player.ID) {
//                 mdata.player.playingToday = true;
//                 mdata.player.winToday = daily.stats.Wins['#text'];
//                 mdata.player.loseToday = daily.stats.Losses['#text'];
//                 mdata.player.saveToday = daily.stats.Saves['#text'];
//                 mdata.player.inningsToday = daily.stats.InningsPitched['#text'];
//                 mdata.player.earnedrunsToday = daily.stats.EarnedRunsAllowed['#text'];
//                 mdata.player.strikeoutsToday = daily.stats.PitcherStrikeouts['#text'];
//               }
//             }
//           }
//         }

//         if (this.myData && this.playerInfo) {
//           console.log('start sorting data for pictures and other info about player...');
//           for (let info of this.playerInfo) {
//             for (let data of this.myData) {

//               if (info.player.ID === data.player.ID) {
//                 if (data.stats.Pitcher2SeamFastballs && data.stats.Pitcher4SeamFastballs && data.stats.PitcherChangeups && data.stats.PitcherCurveballs && data.stats.PitcherCutters && data.stats.PitcherSliders && data.stats.PitcherSinkers && data.stats.PitcherSplitters) {
//                   data.player.favPitch = Math.max(parseInt(data.stats.Pitcher2SeamFastballs['#text'], 10), parseInt(data.stats.Pitcher4SeamFastballs['#text'], 10), parseInt(data.stats.PitcherChangeups['#text'], 10), parseInt(data.stats.PitcherCurveballs['#text'], 10), parseInt(data.stats.PitcherCutters['#text'], 10), parseInt(data.stats.PitcherSliders['#text'], 10), parseInt(data.stats.PitcherSinkers['#text'], 10), parseInt(data.stats.PitcherSplitters['#text'], 10));
//                   data.player.favPitchPercent = Math.floor(data.player.favPitch / parseInt(data.stats.PitchesThrown['#text'], 10) * 100);
//                 }
//                 data.player.image = info.player.officialImageSrc;
//                 data.player.age = info.player.Age;
//                 data.player.city = info.player.BirthCity;
//                 data.player.country = info.player.BirthCountry;
//                 data.player.Height = info.player.Height;
//                 data.player.Weight = info.player.Weight;
//                 data.player.IsRookie = info.player.IsRookie;

//                 //STAT-DATA IS CALLED IN THE HTML
//                 this.statData = this.myData;

//                 //This fills the table with data
//                 this.dataSource = new MyDataSource(this.statData, this.sort);
                
//               }

//             }
//           }

//         }

//         //THIS FOR LOOP GETS AVG PITCH SPEED FOR EVERY PITCHER IN THIS LIST
//         this.myData.forEach((data) => {
//           data.player.latestPitchSpeeds = this.speedResults[data.player.ID];

//           if (data.player.latestPitchSpeeds) {
//             let avg = data.player.latestPitchSpeeds.reduce((r, a) => {

//               return r + parseInt(a.pitchspeedStart);

//             }, 0) / data.player.latestPitchSpeeds.length;

//             data.player.pitchSpeedAvg = Math.floor(avg);

//           }

//         });
//        this.loading = false;
//       });

      
   

//     //THESE FUNCTIONS WORK TOGETHER TO MAKE MULTIPLE API CALLS AND PUSH IT ALL TO FIREBASE
//     // this.infoService
//     //   .getGameId(token).subscribe(res => {
//     //     console.log(res, 'gameID data!');
//     //     //this.gameIdData = res['fullgameschedule'].gameentry;

//     //     //console.log(g.id, 'games from 5 days ago to yesterday');

//     //     //     this.infoService
//     //     // .getFastball(res['fullgameschedule'].gameentry)

//     //     //THIS CHUNK SAVES MAKES MULTIPLE API CALLS AND SAVES LARGE CHUNKS OF DATA TO FIREBASE
//     //     Observable.forkJoin(
//     //       res['fullgameschedule'].gameentry.map(
//     //         g =>
//     //         this.http.get('https://api.mysportsfeeds.com/v1.1/pull/mlb/2017-regular/game_playbyplay.json?gameid=' + g.id + '&status=final', options)
//     //         .map(response => response.json())
//     //       )
//     //     ).subscribe(res => {
//     //       //count+=1;
//     //       let i;
//     //       res.forEach((item, index) => {
//     //         i = index;
//     //         //console.log(res[i]['gameplaybyplay'], 'got game data!');
//     //         this.firebaseService
//     //           .addData(res[i]['gameplaybyplay'].atBats.atBat);

//     //       });


//     //     });

//     //   });

//   }

//   ngOnInit() {
//     this.loadEnv();
//   }

//   public open(event, data) {
//     console.log(data, 'ok you clicked on a table row....');
//     this.dialog.open(MyDialog, {
//       data: data,
//       width: '600px',
//     });

//   }

}

// @Component({
//   selector: 'my-dialog',
//   template: `<md-dialog-content>
//   <md-icon (click)="dialogRef.close()" style="float:right; cursor:pointer;">close</md-icon>
// </md-dialog-content>
// <md-grid-list cols="3" rowHeight="200px">
//   <md-grid-tile [colspan]="1">
//     <img src="{{ data.player.image }}">
//   </md-grid-tile>
//   <md-grid-tile [colspan]="2">
//     <p>{{ data.player.FirstName + ' ' + data.player.LastName + ' (' + data.team.Name + ' - ' + data.player.Position + ')'}} <span *ngIf="data.player.IsRookie == 'true'" style="background:#2ecc71; color:#fff; padding:3px; border-radius:2px;">Rookie</span>
//       <br> Age: {{data.player.age}} Height: {{data.player.Height}} Weight: {{data.player.Weight}}
//       <br> Birth City: {{data.player.city +', '+ data.player.country}}
//       <br> Number: {{data.player.JerseyNumber}}</p>
//   </md-grid-tile>
// </md-grid-list>
// <md-grid-list cols="3" rowHeight="50px">
//   <md-grid-tile [colspan]="1">
//     <h1><b>W-L:</b> {{ data.stats.Wins['#text'] +'-'+ data.stats.Losses['#text'] }}</h1>
//   </md-grid-tile>
//   <md-grid-tile [colspan]="1">
//     <h1><b>ERA:</b> {{ data.stats.EarnedRunAvg['#text'] }}</h1>
//   </md-grid-tile>
//   <md-grid-tile [colspan]="1">
//     <h1><b>K's:</b> {{ data.stats.PitcherStrikeouts['#text'] }}</h1>
//   </md-grid-tile>
// </md-grid-list>
// <div class="fav-pitch">
//   <h2 *ngIf="data.player.favPitch == data.stats.Pitcher2SeamFastballs['#text']">Uses the 2-Seam Fastball {{data.player.favPitchPercent}}% of pitches thrown.</h2>
//   <h2 *ngIf="data.player.favPitch == data.stats.Pitcher4SeamFastballs['#text']">Uses the 4-Seam Fastball {{data.player.favPitchPercent}}% of pitches thrown.</h2>
//   <h2 *ngIf="data.player.favPitch == data.stats.PitcherChangeups['#text']">Uses the Changeup {{data.player.favPitchPercent}}% of pitches thrown.</h2>
//   <h2 *ngIf="data.player.favPitch == data.stats.PitcherCurveballs['#text']">Uses the Curveball {{data.player.favPitchPercent}}% of pitches thrown.</h2>
//   <h2 *ngIf="data.player.favPitch == data.stats.PitcherCutters['#text']">Uses the Cutter {{data.player.favPitchPercent}}% of pitches thrown.</h2>
//   <h2 *ngIf="data.player.favPitch == data.stats.PitcherSliders['#text']">Uses the Slider {{data.player.favPitchPercent}}% of pitches thrown.</h2>
//   <h2 *ngIf="data.player.favPitch == data.stats.PitcherSinkers['#text']">Uses the Sinker {{data.player.favPitchPercent}}% of pitches thrown.</h2>
//   <h2 *ngIf="data.player.favPitch == data.stats.PitcherSplitters['#text']">Uses the Splitter {{data.player.favPitchPercent}}% of pitches thrown.</h2>
// </div>
// <div class="fav-pitch" *ngIf="data.player.pitchSpeedAvg">
//   <h2>Avg pitch speed is {{data.player.pitchSpeedAvg}}mph</h2>
// </div>
// <div class="fav-pitch" *ngIf="data.player.winToday == '1'">
//   <h2>{{ data.player.FirstName + ' ' + data.player.LastName}} got a Win today!</h2>
// </div>
// <div class="fav-pitch" *ngIf="data.player.loseToday == '1'">
//   <h2>{{ data.player.FirstName + ' ' + data.player.LastName}} Lost today!</h2>
// </div>
// <div class="fav-pitch" *ngIf="data.player.saveToday == '1'">
//   <h2>{{ data.player.FirstName + ' ' + data.player.LastName}} got a Save today!</h2>
// </div>
// <div class="fav-pitch" *ngIf="data.player.winToday == '0' && data.player.saveToday == '0' && data.player.loseToday == '0'">
//   <h2>{{ data.player.FirstName + ' ' + data.player.LastName}} pitched {{data.player.inningsToday}} innings, {{data.player.strikeoutsToday}} strikeouts and gave up {{data.player.earnedrunsToday}} runs today!</h2>
//   <button md-button class="more-stats-btn" routerLink="/daily-stats" (click)="dialogRef.close()">MORE STATS</button>

// </div>`,
// })

// export class MyDialog {
//   constructor(public dialogRef: MdDialogRef<MyDialog>, @Inject(MD_DIALOG_DATA) public data: any) {}
// }

// export class MyDataSource extends DataSource < Data > {
//   //console.log(Data[], 'data[]');
//   constructor(private datas: Data[], private sort: MdSort) {
//     super();

//   }



//   /** Connect function called by the table to retrieve one stream containing the data to render. */
//   connect(): Observable < Data[] > {
//     //return Observable.of(this.data);
//     const displayDataChanges = [
//       Observable.of(this.datas),
//       this.sort.mdSortChange,
//     ];

//     return Observable.merge(...displayDataChanges).map(() => {
//       return this.getSortedData();
//     });
//   }

//   disconnect() {}

//   /** Returns a sorted copy of the database data. */
//   getSortedData(): Data[] {
//     const data = this.datas.slice();
//     if (!this.sort.active || this.sort.direction == '') { return data; }

//     return data.sort((a, b) => {
//       //console.log(a, 'a');
//       //console.log(a, 'b');
//       let propertyA: number | string = '';
//       let propertyB: number | string = '';

//       switch (this.sort.active) {
//         // ['id', 'pitches', 'strikeouts', 'inningsPitched', 'battersHit', 'pitcherWildPitches', 'pitcherWalks', 'pitchesPerInning', 'pickoffAttempts'];
//         //case 'id': [propertyA, propertyB] = [a.index, b.index]; break;
//         case 'pitches':
//           [propertyA, propertyB] = [a['stats'].PitchesThrown['#text'], b['stats'].PitchesThrown['#text']];
//           break;
//         case 'strikeouts':
//           [propertyA, propertyB] = [a['stats'].PitcherStrikeouts['#text'], b['stats'].PitcherStrikeouts['#text']];
//           break;
//         case 'pitcherWalks':
//           [propertyA, propertyB] = [a['stats'].PitcherWalks['#text'], b['stats'].PitcherWalks['#text']];
//           break;
//         case 'inningsPitched':
//           [propertyA, propertyB] = [a['stats'].InningsPitched['#text'], b['stats'].InningsPitched['#text']];
//           break;
//         case 'pitchesPerInning':
//           [propertyA, propertyB] = [a['stats'].PitchesPerInning['#text'], b['stats'].PitchesPerInning['#text']];
//           break;
//         case 'pitcherWildPitches':
//           [propertyA, propertyB] = [a['stats'].PitcherWildPitches['#text'], b['stats'].PitcherWildPitches['#text']];
//           break;
//         case 'pickoffAttempts':
//           [propertyA, propertyB] = [a['stats'].PickoffAttempts['#text'], b['stats'].PickoffAttempts['#text']];
//           break;

//       }

//       let valueA = isNaN(+propertyA) ? propertyA : +propertyA;
//       let valueB = isNaN(+propertyB) ? propertyB : +propertyB;

//       return (valueA < valueB ? -1 : 1) * (this.sort.direction == 'asc' ? 1 : -1);
//     });
//   }

// }
