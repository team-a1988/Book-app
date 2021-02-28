
// load the server dependencies
var express = require('express');
const cors=require('cors');

let ejs = require('ejs');

var app = express();
app.use(cors());

app.use(express.static('./public'));

require('dotenv').config();

const PORT=process.env.PORT;

// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

/********************************** **
***************END POINTS  ***********
***************************************/ 
// index page 
app.get('/hello', (req, res)=> {
    console.log("the main route")
	res.render('./pages/index');
});

app.listen(PORT,()=>{
    console.log('app is lestining in port ....',PORT);
});
