const express = require('express');
const http = require('http');
const path = require('path');

const api = require('./server/routes/api');

const app = express();

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'))
});

app.get('/main.bundle.js', function(req, res){
       
       res.write("let FIREBASE_URL='"+process.env.FIREBASE_URL+"'" + '\n');
       res.write("let API_KEY='"+process.env.API_KEY+"'" + '\n');
       res.write("let AUTH_DOM='"+process.env.AUTH_DOM+"'" + '\n');
       res.write("let TOKEN='"+process.env.PP_API_KEY+"'" + '\n');
       res.end();
});

const port = process.env.PORT || '3001';
app.set('port', port);

const server = http.createServer(app);
server.listen(port, () => console.log(`Running on localhost:${port}`));
