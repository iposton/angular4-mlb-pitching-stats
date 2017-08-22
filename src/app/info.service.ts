import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers, Request, RequestMethod } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/publishReplay';

@Injectable()
export class InfoService{
  
  info:Observable<any> = null;
  stats:Observable<any> = null;
  env:Observable<any> = null;
  gameid:Observable<any> = null;

  constructor(private http:Http){}


  getEnv() {
    console.log("trying to get heroku env...");
    this.env = this.http.get('/heroku-env').map(response => response)
    return this.env;
  }
  
  
  clearCache(){
    this.info = null; 
  }
  
  getInfo(token) {
    

    if(!this.info) {
     let headers = new Headers({ "Authorization": "Basic " + btoa('ianposton' + ":" + token) });
     let options = new RequestOptions({ headers: headers });
     let url2 = 'https://api.mysportsfeeds.com/v1.1/pull/mlb/2017-regular/active_players.json?position=P';
      console.log('getting player info data from API...');
      this.info = this.http.get(url2, options)
      .map(response => response.json())
      .publishReplay(1) // this tells Rx to cache the latest emitted value
      .refCount()
    }
    return this.info;
  }

  getStats(token) {
    
    if(!this.stats) {
    console.log('getting stat data from API...');
    let headers = new Headers({ "Authorization": "Basic " + btoa('ianposton' + ":" + token) });
    let options = new RequestOptions({ headers: headers });
    let url = 'https://api.mysportsfeeds.com/v1.1/pull/mlb/2017-regular/cumulative_player_stats.json?position=P&sort=STATS.Pitching-NP.D&limit=275';
      this.stats = this.http.get(url, options)
      .map(response => response.json())
    }
    return this.stats;
  }

  getGameId(token) {
    
    if(!this.gameid) {
    console.log('getting pitch speed data from API...');
    let headers = new Headers({ "Authorization": "Basic " + btoa('ianposton' + ":" + token) });
    let options = new RequestOptions({ headers: headers });
    let url4 = 'https://api.mysportsfeeds.com/v1.1/pull/mlb/2017-regular/full_game_schedule.json?date=from-8-days-ago-to-6-days-ago';
    this.gameid = this.http.get(url4, options)
    .map(response => response.json())
   }
   return this.gameid;
  }


}