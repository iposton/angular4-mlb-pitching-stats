import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers, Request, RequestMethod } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/publishReplay';

let sending;
let sent;

let headers = null;
let options = null;

let thisDate = new Date();
let utcDate = new Date(thisDate.toUTCString());
utcDate.setHours(utcDate.getHours() - 8);
let myDate = new Date(utcDate);
let dailyDate = myDate.toISOString().slice(0, 10).replace(/-/g, "");
//console.log(dailyDate, 'today\'s date');

@Injectable()
export class InfoService {

  info: Observable < any > = null;
  stats: Observable < any > = null;
  env: Observable < any > = null;
  gameid: Observable < any > = null;
  daily: Observable < any > = null;
  schedule: Observable < any > = null;

  constructor(private http: Http) {}

  sendHeaderOptions(h, o) {
    console.log('got headers & options in info service...')
    headers = h;
    options = o;
  }


  getDailySchedule() {
    //get all games for today get game ID and find a pitchers opponent
    if (!this.schedule) {
      console.log('getting stat data from API...');

      let url5 = 'https://api.mysportsfeeds.com/v1.1/pull/mlb/2017-playoff/daily_game_schedule.json?fordate='+dailyDate;
      this.schedule = this.http.get(url5, options)
        .map(response => response.json())
    }
    return this.schedule;

  }


  getEnv() {
    console.log("trying to get heroku env...");
    this.env = this.http.get('/heroku-env').map(response => response)
    return this.env;
  }


  sendStats(statsArray) {
    console.log("sending stats to service...");
    sending = statsArray;
  }

  getSentStats() {
    console.log("stats sent to component...");
    sent = sending;
    return sent;
  }


  clearCache() {
    this.info = null;
  }

  getInfo() {

    if (!this.info) {

      let url2 = 'https://api.mysportsfeeds.com/v1.1/pull/mlb/2017-regular/active_players.json?position=P';
      console.log('getting player info data from API...');
      this.info = this.http.get(url2, options)
        .map(response => response.json())
        .publishReplay(1) // this tells Rx to cache the latest emitted value
        .refCount()
    }
    return this.info;
  }

  getStats() {

    if (!this.stats) {
      console.log('getting stat data from API...');

      let url = 'https://api.mysportsfeeds.com/v1.1/pull/mlb/2017-regular/cumulative_player_stats.json?position=P&sort=STATS.Pitching-NP.D&limit=275';
      this.stats = this.http.get(url, options)
        .map(response => response.json())
    }
    return this.stats;
  }

  getGameId() {

    if (!this.gameid) {
      console.log('getting pitch speed data from API...');

      let url3 = 'https://api.mysportsfeeds.com/v1.1/pull/mlb/2017-playoff/full_game_schedule.json?date=from-8-days-ago-to-2-days-ago';
      this.gameid = this.http.get(url3, options)
        .map(response => response.json())
    }
    return this.gameid;
  }

  getDaily() {

    if (!this.daily) {
      let url4 = 'https://api.mysportsfeeds.com/v1.1/pull/mlb/2017-playoff/daily_player_stats.json?fordate='+dailyDate+'&position=P';
      console.log('getting daily stats for pitchers from API...');
      this.daily = this.http.get(url4, options)
        .map(response => response.json())
    }
    return this.daily;
  }
}