const express = require('express');
const router = express.Router();

/* GET api listing. */
// router.get('/', (req, res) => {
//   res.send('api works');
// });

router.get('/', (req, res) => {
       
       res.write("let FIREBASE_URL='"+process.env.FIREBASE_URL+"'" + '\n');
       res.write("let API_KEY='"+process.env.API_KEY+"'" + '\n');
       res.write("let AUTH_DOM='"+process.env.AUTH_DOM+"'" + '\n');
       res.write("let TOKEN='"+process.env.PP_API_KEY+"'" + '\n');
       res.end();
});

module.exports = router;