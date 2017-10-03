# Angular 4, MLB Pitching Stats MySportsFeeds API, Firebase and Heroku - <a href="https://mlb-pitching-stats.herokuapp.com/">Demo</a> 
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
* [MySportsFeeds API](https://www.mysportsfeeds.com/data-feeds/api-docs/#)

### Clone and serve this app
* First you will need to be given access MySportsFeeds MLB endpoints. As a developer working on a non-commercial app you can be given access to the MLB endpoints. Sign up at MySportsFeeds and use the username and password in the header request to authenticate the api get request. `let headers = new Headers({ "Authorization": "Basic " + btoa('username' + ":" + 'password') });`
* When the api headers are in place clone this repo and run <code>npm install</code> then run <code>ng serve</code> to serve the app on `localhost:4200`. Be careful not to push your api password to github.

### Get data from api with HttpClient module
The first thing I want to do in this app is get a list of all the pitchers in major league baseball. I used the [MySportsFeeds API](https://www.mysportsfeeds.com/data-feeds/api-docs/#) to find the correct endpoint to get all pitchers. I am able to use Angular's http module to send a GET request for data using this endpoint `https://api.mysportsfeeds.com/v1.1/pull/mlb/2017-regular/active_players.json?position=P` found in the api's documentation. 

```js

//app.component.ts 

import { Component, ViewChild, Inject, OnInit } from '@angular/core';
import { Http, Response, RequestOptions, Headers, Request, RequestMethod } from '@angular/http';

let headers = new Headers({ "Authorization": "Basic " + btoa('username' + ":" + 'password') });
let options = new RequestOptions({ headers: headers });
let url = 'https://api.mysportsfeeds.com/v1.1/pull/mlb/2017-regular/cumulative_player_stats.json?position=P&sort=STATS.Pitching-NP.D&limit=275';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
   
   statData: Array<any>;

   constructor(private http: Http) {}

   loadData() {
    this.http.get(url, options)
     .map(response => response.json())
      .subscribe(res => {
        console.log(res['activeplayers'].playerentry, 'got player info res!');
        
        this.statData = res['activeplayers'].playerentry;

      
      });
   }

   ngOnInit() {
    loadData();
   }
}

```

```html

//app.component.html

 <ul>
  <li *ngFor="let data of statData"> 
    {{ data.player.FirstName + ' ' + data.player.LastName + ' - ' + data.team.Abbreviation}}
  </li>
 </ul>

```

### Deploy an Angular4 app to Heroku.
* For Heroku this app uses a node.js server <code>app.js</code> with express.
* All routes will be going to <code>dist/index.html</code>. 
* Run <code>ng build</code> to build the app in the dist directory.
* Run <code>node app.js</code> to serve the app at <code>http://localhost:3001</code>.
* The <code>Procfile</code> in this app's root specifies the server for heroku to use.

```
//Procfile

web: node app.js

```

* This <code>"main": "app.js"</code> line in package.json specifies how to tell heroku to look for <code>app.js</code>.
* Before pushing to github, before heroku deploy set Config Variables.  

```

Adding the environment variable for the MySportsFeeds api. I didn't want to share my api headers information in my github repository so I added my password to my Config Variables for heroku to use in the app settings from the Heroku dashboard. I stored the password in my heroku app by going to the app settings in my heroku dashboard. Click on Config Variables and add the key (name) and value (password) there. It will be secured safely away from human view. You can call it to the client side by adding this code to the app.js file. I called my env API_TOKEN and made the value MySportsFeeds password.

```

* Use the [Heroku Client API](https://github.com/heroku/node-heroku-client) to retrieve the API_TOKEN from the app and then send it to the front-end of the angular app like this. 

```js

//app.js 

const express = require('express');
const http = require('http');
const path = require('path');
const Heroku = require('heroku-client')
const heroku = new Heroku({ token: process.env.API_TOKEN })
const api = require('./server/routes/api');
const app = express();

let TOKEN = '';

app.use(express.static(path.join(__dirname, 'dist')));

//GET CONFIG VAR FROM SPECIFIC HEROKU APP
heroku.request({
  method: 'GET',
  path: 'https://api.heroku.com/apps/my-app-name/config-vars',
  headers: {
    "Accept": "application/vnd.heroku+json; version=3",
    "Authorization": "Bearer "+process.env.API_TOKEN
  },
  parseJSON: true
}).then(response => {
  //console.log(response.API_KEY, "heroku api from server");
  TOKEN = response.TOKEN;
})

//SEND CONFIG VAR TO FRONT-END APP.COMPONENT.TS
app.get('/heroku-env', function(req, res){
        res.write(TOKEN);
        res.end();
});

//SPECIFY NG-BUILD PATH
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'))
});

//HEROKU PORT
const port = process.env.PORT || '3001';
app.set('port', port);

const server = http.createServer(app);
server.listen(port, () => console.log(`Running on localhost:${port}`));

```

After you <code>git push</code> to your repo follow the steps below. Assuming you have a heroku account and installed the heroku toolbelt. 
<ol>
  <li>run <code>heroku log in</code></li>
  <li>run <code>heroku create name-of-app</code></li>
  <li>run <code>git push heroku master</code></li>
  <li>If deploy is successful run <code>heroku open</code></li>
  If there were problems during deploy and you are trying this from scratch here are some requirements heroku needs to deploy.
  <li>Have <code>@angular/cli</code> and <code>@angular/compiler-cli</code> listend under dependencies in <code>package.json</code>.</li>
  <li>have a <code>server/routes</code> directory with <code>api.js</code> </li>

```js

//api.js

const express = require('express');
const router = express.Router();

/* GET api listing. */
router.get('/', (req, res) => {
  res.send('api works');
});

module.exports = router;

```
</ol>

References for deploying Angular4 to heroku: [https://medium.com/@ervib/deploy-angular-4-app-with-express-to-heroku-6113146915ca](https://medium.com/@ervib/deploy-angular-4-app-with-express-to-heroku-6113146915ca)

### Save Data to FireBase.

