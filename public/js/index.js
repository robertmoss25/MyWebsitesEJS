const itemsPerPage = 6;
var currentPos = 0;
var totalSize = 0;
const header = document.getElementById('header');
const header2 = document.getElementById('header2');
const previous = document.getElementById('previous');
const next = document.getElementById('next');
const link2 = document.getElementById('link2');
const link3 = document.getElementById('link3');
const currentPageDetails = document.getElementById('currentPageDetails');
const dropdown = document.getElementById('dropdown');
const dropdownMenuLink = document.getElementById('dropdownMenuLink');
const categoryArray = {};
let totalCategories = 0;

let innerHTML = '';

getCategories();
loadQuestions();

function getCategories() {
    let innerHTML = '';

    fetch("./json/websites.json")
    .then(response => response.json())
    .then(json => {
        let localCategoryArray = {}
        for (let i = currentPos; i < json.length; i++) {
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
        for (let index = 0; index < items.length; index++) {
            categoryArray[index] = items[index];
        } 

        for(var key in categoryArray) {
            innerHTML += '<a class="dropdown-item" href="#" onclick="handleDropDownClick(event,';
            innerHTML += key;
            innerHTML += ')"';
            innerHTML += ' id=';
            innerHTML += key;
            innerHTML += '>';
            innerHTML += categoryArray[key];
            innerHTML += '</a>';
        }
        dropdown.innerHTML = innerHTML;
            
    }).catch(err => {
        console.error(err);
    });
}

function loadQuestions() {
    innerHTML = '';

    fetch("./json/websites.json")
    .then(response => response.json())
    .then(json => {
        totalSize = json.length;
        previous.hidden = currentPos <= 0;
        next.hidden = Number(currentPos)+Number(itemsPerPage) >= totalSize;
        let range = (totalSize / itemsPerPage);
        link2.hidden = totalSize < itemsPerPage+1;
        link3.hidden = totalSize < (itemsPerPage*2)+1;
        var calcValue = Number(currentPos) + Number(itemsPerPage);
        let endPos = Math.min(totalSize, calcValue);
        for (let i = currentPos; i < endPos; i++) {
            innerHTML += ' <tr>';
            innerHTML += '<th scope="row">';
            innerHTML += '<a href="'
            innerHTML += json[i].url;
            innerHTML += '" target="_blank">';
            innerHTML += json[i].url;
            innerHTML += "</a> ";
            innerHTML += '</th>';
            innerHTML += '<td>';
            innerHTML += json[i].Category;
            innerHTML += '</td>';
            innerHTML += '<td>';
            innerHTML += json[i].Comment;
            innerHTML += '</td>';
            innerHTML += '</tr>';
        }

        header.innerHTML = innerHTML;
        let value = (currentPos / itemsPerPage)+1;
        let totalPages = Math.ceil((totalSize / itemsPerPage));
        currentPageDetails.innerHTML = "Page " + Math.floor(value) + " of " + totalPages;
    }).catch(err => {
        console.error(err);
    });
}

function loadCategoryQuestions(value) {
    innerHTML = '';

    fetch("./json/websites.json")
    .then(response => response.json())
    .then(json => {
        for (let i = 0; i < json.length; i++) {
            let bFound = false;
            let splitStrings = json[i].Category.split(',');
            splitStrings.forEach(element => {
                if (element.trim().toUpperCase() == value) 
                    bFound = true;
            });
            if (bFound) {
                innerHTML += ' <tr>';
                innerHTML += '<th scope="row">';
                innerHTML += '<a href="'
                innerHTML += json[i].url;
                innerHTML += '" target="_blank">';
                innerHTML += json[i].url;
                innerHTML += "</a> ";
                innerHTML += '</th>';
                innerHTML += '<td>';
                innerHTML += json[i].Category;
                innerHTML += '</td>';
                innerHTML += '<td>';
                innerHTML += json[i].Comment;
                innerHTML += '</td>';
                innerHTML += '</tr>';
            }
        }
        header2.innerHTML = innerHTML;
    }).catch(err => {
        console.error(err);
    });
}

function handleClickPage(event, item) {
    if (item < 0)
        currentPos = Math.max(0, Number(currentPos) - Number(itemsPerPage));
    else if (item == 0)
        currentPos = Math.min(totalSize, Number(currentPos) + Number(itemsPerPage));
    else
        currentPos = Math.min(totalSize, (Number(itemsPerPage) * (Number(item)-1)));
    loadQuestions();
}

function handleClickBegin(event) {
    currentPos = 0;
    loadQuestions();
}

function handleClickEnd(event) {
    let totalPages = Math.ceil((totalSize / itemsPerPage));
    currentPos = (Number(totalPages)-1) * itemsPerPage;
    loadQuestions();
}

function handleDropDownClick(event, value) {
    dropdownMenuLink.innerHTML = categoryArray[value];
    loadCategoryQuestions(categoryArray[value]);
} 

function handleAddNewWebsite() {
    window.location.href = "public/html/Websiteform.html";
}