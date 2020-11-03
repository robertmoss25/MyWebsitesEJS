const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const fileName = __dirname + '/public/json/websites.json';

var file_content = fs.readFileSync(fileName);
var content = JSON.parse(file_content);

const app = express();

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded( {extended: true}));

app.get("/documents", function(req,res) {
    res.sendFile(__dirname + "/public/html/Websiteform.html");
});

app.get("/", function(req,res) {
    res.sendFile(__dirname + '/index.html');
});

app.post("/documents", function(req,res) {
    ////let newString = JSON.stringify("{url: 'test@test.com', Category: 'Data Structures', Comment: 'This is a test'}");
    ////content[content.length-1] = newString;
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
    ////let newJSON = JSON.stringify(content);
    ////console.log(newJSON);
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