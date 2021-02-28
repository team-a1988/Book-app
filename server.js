
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


app.get('/searches/new', (req, res)=>{
    res.render('./pages/searches/new')
});
app.get('/searches/show', (req, res)=>{
   console.log(req.query);
   
});
/********************************** **
***************END POINTS  ***********
***************************************/ 
function Book(title,img,authorName,description) {
    this.title=title || 'unknown title';
    this.img=img || 'https://i.imgur.com/J5LVHEL.jpg';
    this.authorName=authorName || 'unknown author';
    this.description=description || 'unavailable description';
}
app.listen(PORT,()=>{
    console.log('app is lestining in port ....',PORT);
});
