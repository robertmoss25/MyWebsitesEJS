module.exports.getCategories = getCategories;
module.exports.loadQuestions = loadQuestions;
module.exports.loadCategoryQuestions = loadCategoryQuestions;
module.exports.saveWebsite = saveWebsite;

const fs = require('fs');
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/Websites", {useNewURLParser: true});

const websiteSchema = new mongoose.Schema({
    url: String,
    Category: String,
    Comment: String
});

const websiteModel = mongoose.model("Favorites", websiteSchema);
//const fileName = 'websites.json';

async function getCategories(categoryArray, currentPos) {
    let innerHTML = '';

    await websiteModel.find(function(err, json) {
        if (err)
            console.log(err);
        else
        {
            let localCategoryArray = {}
            for (let i = 0; i < json.length; i++) {
                let splitStrings = json[i].Category.split(',');
                splitStrings.forEach(element => {
                    localCategoryArray[element.trim().toUpperCase()] = true;
                });
            }
            // Create items array
            var items = Object.keys(localCategoryArray).map(function(key) {
                return [key];
            });

            // Sort the array based on the second element
            items.sort();
            for (let index = currentPos; index < items.length; index++) {
                categoryArray[index] = items[index];
            } 
        }
    });
    return categoryArray;
}

async function loadQuestions(itemsPerPage, currentPos) {
    let innerHTML = '';
    let returnedObject = {};

    await websiteModel.find(function(err, json) {
        if (err)
            console.log(err);
        else
        {
            let returnValue = {};
            totalSize = json.length;
            let previous = currentPos <= 0;
            let range = (totalSize / itemsPerPage);
            let link2 = totalSize < itemsPerPage+1;
            let link3 = totalSize < (itemsPerPage*2)+1;
            var calcValue = Number(currentPos) + Number(itemsPerPage);
            let endPos = Math.min(totalSize, calcValue);
            let index = 0;
            for (let i = currentPos; i < endPos; i++) {
                returnValue[index++] = json[i];
            }

            let value = (currentPos / itemsPerPage)+1;
            let totalPages = Math.ceil((totalSize / itemsPerPage));
            returnedObject.returnValue = returnValue;
            returnedObject.previous = previous;
            returnedObject.range = range;
            returnedObject.link2 = link2;
            returnedObject.link3 = link3;
            returnedObject.value = value;
            returnedObject.totalPages = totalPages;
            returnedObject.totalSize = totalSize;
        }
    });
    return returnedObject;
}

async function loadCategoryQuestions(value) {
    let innerHTML = '';

    let returnValue = {};
    await websiteModel.find(function(err, json) {
        if (err)
            console.log(err);
        else
        {
            let index = 0;
            for (let i = 0; i < json.length; i++) {
                let bFound = false;
                let splitStrings = json[i].Category.split(',');
                splitStrings.forEach(element => {
                    if (element.trim().toUpperCase() == value) 
                        bFound = true;
                });
                if (bFound) {
                    returnValue[index++] = json[i];
                }
            }
        }
    });
    return returnValue;
}

function saveWebsite(newURL) {
    const website = new websiteModel({
        url: newURL.url,
        Category: newURL.Category,
        Comment: newURL.Comment
    });
    console.log(website);
    console.log("Saving");
    website.save();
    // let rawdata = fs.readFileSync(fileName);
    // let json = JSON.parse(rawdata);
    // json.push(newURL);
    // fs.writeFile(fileName, JSON.stringify(json), err => { 
     
    //     // Checking for errors 
    //     if (err) throw err;  
       
    //     console.log("Done writing"); // Success 
    // });
}