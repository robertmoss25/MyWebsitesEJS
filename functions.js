module.exports.getCategories = getCategories;
module.exports.loadQuestions = loadQuestions;
module.exports.loadCategoryQuestions = loadCategoryQuestions;
module.exports.saveWebsite = saveWebsite;

const fs = require('fs');
const fileName = 'websites.json';

function getCategories(categoryArray, currentPos) {
    let innerHTML = '';

    let rawdata = fs.readFileSync(fileName);
    let json = JSON.parse(rawdata);
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
    return categoryArray;
}

function loadQuestions(itemsPerPage, currentPos) {
    let innerHTML = '';

    let rawdata = fs.readFileSync(fileName);
    let json = JSON.parse(rawdata);
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
    return { returnValue, previous, range, link2, link3, value, totalPages, totalSize};
}

function loadCategoryQuestions(value) {
    let innerHTML = '';

    let rawdata = fs.readFileSync(fileName);
    let json = JSON.parse(rawdata);
    let returnValue = {};

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
    return returnValue;
}

function saveWebsite(newURL) {
    let rawdata = fs.readFileSync(fileName);
    let json = JSON.parse(rawdata);
    json.push(newURL);
    fs.writeFile(fileName, JSON.stringify(json), err => { 
     
        // Checking for errors 
        if (err) throw err;  
       
        console.log("Done writing"); // Success 
    });
}