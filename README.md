# Angular 4, MLB Pitching Stats MySportsFeeds API and Heroku - <a href="https://mlb-pitching-stats.herokuapp.com/">Demo</a> 
This is a single page app which uses the [MySportsFeeds API](https://www.mysportsfeeds.com/data-feeds/api-docs/#) to get up-to-date major league baseball data. 

### Description
This [application](https://mlb-pitching-stats.herokuapp.com/) is made with Angular (version 4.0.0) and the most current version of angular material2. This SPA app is hosted for free on Heroku (cloud application platform). The data is sourced through the [MySportsFeeds API](https://www.mysportsfeeds.com/data-feeds/api-docs/#).

This app can help explain how to fetch data using [Angular's HttpClient Module](https://angular.io/guide/http) from a robust api.  

### You can learn this
* Use the HttpClient module to connect to an api and get data returned in milliseconds. 
* Deploy an Angular4 app to Heroku.
* Save data to firebase.
* Get Data from firebase. 
* Use api response to make custom data not provided by the api.    

### Software used for this application
* Angular (version 4.0.0) 
* Angular CLI (version 1.2.1)
* Angular http (version 4.0.0)
* Node.js (version 6.10.3)     
* [angular material2](https://github.com/angular/material2) (version 2.0.0-beta.8)
* Heroku [Set up a free account ](https://www.heroku.com/)
* Firebase (version 4.2.0) 
* AngularFire2 (version 4.0.0-rc.1)
* NPM (version 5.2.0)
* Heroku Client (version 3.0.3)
* rxjs (version 5.1.0)
* MySportsFeeds API](https://www.mysportsfeeds.com/data-feeds/api-docs/#)

### Clone and serve this app
* First you will need to be given access MySportsFeeds MLB endpoints. As a developer working on a non-commercial app you can be given access to the MLB endpoints. Sign up at MySportsFeeds and use the username and password in the header request to authenticate the api get request. `let headers = new Headers({ "Authorization": "Basic " + btoa('username' + ":" + 'password') });`
* When the api headers are in place clone this repo and run <code>npm install</code> then run <code>ng serve</code> to serve the app on `localhost:4200`. Be careful not to push your api password to github.

### Get data from api with HttpClient module
The first thing I want to do in this app is get a list of all the pitchers in major league baseball. I used the [MySportsFeeds API](https://www.mysportsfeeds.com/data-feeds/api-docs/#) to find the correct endpoint to get all pitchers. I am able to use Angular's http module to send a GET request for data using this endpoint `https://api.mysportsfeeds.com/v1.1/pull/mlb/2017-regular/active_players.json?position=P` found in the api's documentation. 

```js

//app.component.ts 

import { Component, ViewChild, Inject } from '@angular/core';
import { Http, Response, RequestOptions, Headers, Request, RequestMethod } from '@angular/http';

let headers = new Headers({ "Authorization": "Basic " + btoa('username' + ":" + 'password') });
let options = new RequestOptions({ headers: headers });
let url = 'https://api.mysportsfeeds.com/v1.1/pull/mlb/2017-regular/cumulative_player_stats.json?position=P&sort=STATS.Pitching-NP.D&limit=275';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

   constructor(private http: Http) {}

   loadData() {
    this.http.get(url, options)
     .map(response => response.json())
      .subscribe(res => {
        console.log(res['activeplayers'].playerentry, 'got player info res!');
      
      });
   }

   ngOnInit() {
    loadData();
   }
}

```