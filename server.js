const express = require("express");
const bodyParser = require("body-parser");
const functions = require(__dirname + "/functions.js");

let categoryArray = {};
const itemsPerPage = 6;
var currentPos = 0;
var totalSize = 0;
let results = {};
let array = {};

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

function SetUpResults() {
    totalSize = results.totalSize;
    results.Categories = categoryArray;
    results.itemsPerPage = itemsPerPage;
    let nextHidden = Number(results.currentPos)+Number(results.itemsPerPage) >= results.totalSize;
    results.currentPos = currentPos;
    results.nextHidden = nextHidden;
    results.array = array;
}

app.get("/", async (req,res) => {
    categoryArray = await functions.getCategories(categoryArray, currentPos);
    results = await functions.loadQuestions(itemsPerPage, currentPos);
    SetUpResults();
    res.render("index", {results: results});
});

app.get("/documents", function(req,res) {
    res.render("addnewwebsite");
});

app.post("/documents", function(req,res) {
    let newURL = {
        url: req.body.url,
        Category: req.body.Categories,
        Comment: req.body.Comment
    }
    functions.saveWebsite(newURL);
    currentPos = 0;
    res.redirect("/");
});

app.get("/category", async (req,res) => {
    array = await functions.loadCategoryQuestions(categoryArray[req.query.key]);
    SetUpResults();
    res.render("index", {results: results});
});

app.get("/paging", async (req,res) => {
    let command = req.query.command;
    let item = req.query.value;

    if (command == 'begin') {
        currentPos = 0;
    } 
    else if (command == 'end') 
    {
        let totalPages = Math.ceil((totalSize / itemsPerPage));
        currentPos = (Number(totalPages)-1) * itemsPerPage;
    }
    else if (command == 'previous' || command == 'link' || command == 'next')  
    {
        if (item < 0)
            currentPos = Math.max(0, Number(currentPos) - Number(itemsPerPage));
        else if (item == 0)
            currentPos = Math.min(totalSize, Number(currentPos) + Number(itemsPerPage));
        else
            currentPos = Math.min(totalSize, (Number(itemsPerPage) * (Number(item)-1)));
    }
    results = await functions.loadQuestions(itemsPerPage, currentPos);
    SetUpResults();
    res.render("index", {results: results});
});

app.listen(3000, function() {
    console.log("Server started on port 3000");
});