const express = require('express');
const http = require('http');
const path = require('path');
const Heroku = require('heroku-client')
const heroku = new Heroku({ token: '021d54f5-5a75-42c5-be2b-7bd9ece68c19' })

const api = require('./server/routes/api');

const app = express();

let API_KEY = '',
AUTH_DOM = '',
TOKEN = '',
FIREBASE_URL = '';

app.use(express.static(path.join(__dirname, 'dist')));


heroku.request({
  method: 'GET',
  path: 'https://api.heroku.com/apps/mlb-pitching-stats/config-vars',
  headers: {
    "Accept": "application/vnd.heroku+json; version=3",
    "Authorization": "Bearer 021d54f5-5a75-42c5-be2b-7bd9ece68c19"
  },
  parseJSON: true
}).then(response => {
  //console.log(response.API_KEY, "heroku api from server");
  API_KEY = response.API_KEY;
  AUTH_DOM = response.AUTH_DOM;
  TOKEN = response.TOKEN;
  FIREBASE_URL = response.FIREBASE_URL;
})

app.get('/heroku-env', function(req, res){
        res.write(TOKEN);
        res.end();
});

app.get('/heroku-env-firebase', function(req, res){
        res.write(FIREBASE_URL);
        res.end();
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'))
});


const port = process.env.PORT || '3001';
app.set('port', port);

const server = http.createServer(app);
server.listen(port, () => console.log(`Running on localhost:${port}`));
