
// load the server dependencies
const express = require('express');
const cors = require('cors');
const ejs = require('ejs');
const pg = require('pg');
// configuration
require('dotenv').config();
const app = express();
const superagent = require('superagent');
const { text } = require('express');
app.use(cors());
const client = new pg.Client(process.env.DATABASE_URL);




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

app.get('/', (req, res) => {
    console.log("hello i am here ...............................");
    const query='SELECT author,title,isbn,image_url,description FROM books';
    client.
    query(query).
    then(data=>{
        // console.log(data.rows);
        // console.log("the data rows ",data.rows);
        // console.log("the type data.rows of ",typeof data);
        res.render('./pages/index',{"books":data.rows})
    }).catch(error=>{
        console.log(error);
        res.render('./pages/error', { "error": error })
    });
    
})



app.post('/searches/show', (req, res) => {
    //{ searchQuery: 'hello', searchBy: 'title', search: 'search' }
    //request google  google book api 

    let baseAPIUrl = "https://www.googleapis.com/books/v1/volumes"
    let searchQuery = req.body.searchQuery + "+" + req.body.searchBy;
    let query = {
        q: searchQuery,
    }
    superagent.get(baseAPIUrl).query(query).then(data => {
        // console.log(data.body.items);
        var results = [];
        for (let index = 0; index < 10; index++) {
            const element = data.body.items[index];
            const book = new Book(
                element.volumeInfo.title,
                element.volumeInfo.imageLinks.thumbnail,
                element.volumeInfo.authors,
                element.volumeInfo.description,
                element.volumeInfo.industryIdentifiers
            );
            results.push(book);
            console.log(results);

        }
        res.render('./pages/searches/show', { "results": results });
    }).catch(error => {
        console.log(error);
        res.render('./pages/error', { "error": error })
    });
});

app.get('/books/:id', (req,res)=>{
    let id = req.params.id;
    const query='SELECT author,title,isbn,image_url,description FROM books WHERE id=$1';
    let safeValue = [id];
    client.
    query(query,safeValue).
    then(data=>{
        // console.log("the data rows ",data.rows);
        // console.log("the type data.rows of ",typeof data);
        res.render('./pages/index')
    }).catch(error=>{
        console.log(error);
        res.render('./pages/error', { "error": error })
    });
    
})

/********************************** **
***************END POINTS  ***********
***************************************/
function Book(title, img, authorName, description, isbn) {
    this.title = title || 'unknown title';
    this.img = img || 'https://i.imgur.com/J5LVHEL.jpg';
    this.img = secure(img);
    this.authorName = formatAuthor(authorName) || 'unknown author';
    this.description = description || 'unavailable description';
    this.isbn = formatIsbn(isbn) || "unavailable isbn";
}
/***************************************** 
*****************************************
***************helper********************
*******************************************/
function secure(url) {
    if (url[5] != 's') {
        var i = url.split("")
        i.splice(4, 0, 's');
    }
    return i.join("");
}
function formatIsbn(isbn) {
    if (isbn.length!=0) 
        return isbn[0].type + " " + isbn[0].identifier//isbn
    return null;
}
function formatAuthor(author){
    if(typeof author==typeof undefined) return null;
    if (author.length!=0) 
        return author.join(", ");
    return null;
}
client.connect().then(()=>{
    app.listen(PORT, () => {
        console.log('app is lestining in port ....', PORT);
    });
}).catch(error=>{
    console.log('error app is not lestining in port ....', error);
});

