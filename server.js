
// load the server dependencies
var express = require('express');
const cors = require('cors');
let ejs = require('ejs');
var app = express();
const superagent = require('superagent');
const { text } = require('express');
app.use(cors());


require('dotenv').config();

app.use(express.static('./public'));

app.use(express.urlencoded({ extended: true }));


const PORT = process.env.PORT;

// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

/********************************** **
***************END POINTS  ***********
***************************************/
// index page 
app.get('/hello', (req, res) => {
    console.log("the main route")
    res.render('./pages/index');
});


app.get('/searches/new', (req, res) => {
    // console.log(res, req);
    res.render('./pages/searches/new')
});



app.post('/searches/show', (req, res) => {
    //{ searchQuery: 'hello', searchBy: 'title', search: 'search' }
    //request google  google book api 

    let baseAPIUrl = "https://www.googleapis.com/books/v1/volumes"
    let searchQuery = req.body.searchQuery + "+" + req.body.searchBy;
    let query = {
        q: searchQuery,
    }
    superagent.get(baseAPIUrl).query(query).then(data => {
        //console.log(data.body.items[0]);
        var results = [];
        for (let index = 0; index < 10; index++) {
            const element = data.body.items[index];
            const book = new Book(
                element.volumeInfo.title,
                element.volumeInfo.imageLinks.thumbnail,
                element.volumeInfo.authors,
                element.volumeInfo.description
            );
            results.push(book);
        }
        res.render('./pages/searches/show',{"results": results});
    });
});


/********************************** **
***************END POINTS  ***********
***************************************/
function Book(title, img, authorName, description) {
    this.title = title || 'unknown title';
    this.img = img || 'https://i.imgur.com/J5LVHEL.jpg';
    this.img=secure(img);
    this.authorName = authorName || 'unknown author';
    this.description = description || 'unavailable description';
}
function secure(url) {
    if(url[5]!='s'){
        var i=url.split("")
        i.splice(4, 0, 's');
      } 
      return i.join("");
}
app.listen(PORT, () => {
    console.log('app is lestining in port ....', PORT);
});
