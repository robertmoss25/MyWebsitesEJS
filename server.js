const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

app.get("/", function(req,res) {
    res.render("index");
});

app.get("/documents", function(req,res) {
    res.render("addnewwebsite");
});

app.post("/documents", function(req,res) {
    console.log(req.body.url);
    console.log(req.body.Categories);
    console.log(req.body.Comment);
    console.log(content.length);
    let newURL = {
        url: req.body.url,
        Category: req.body.Categories,
        Comment: req.body.Comment
    }
    content.push(newURL);
    fs.writeFile(fileName, JSON.stringify(content), err => { 
     
        // Checking for errors 
        if (err) throw err;  
       
        console.log("Done writing"); // Success 
    }); 
    res.redirect("/");
});

app.listen(3000, function() {
    console.log("Server started on port 3000");
});