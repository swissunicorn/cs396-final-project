//////////////////////
// page 1 functions //
//////////////////////

let address; // make them just enter a street name bc we assume it's Evanston

const goButtonPress = () => {
    if(!document.getElementById("location").value) {
        address = "";
    }
    else {
        address = document.getElementById("location").value + ", Evanston, IL, 60201";
        document.getElementById('choice').innerHTML += `<p> Address: "${address}" </p>`;
    }
    console.log(address);
    // I guess I'm just going to assume that the address is correct
    //doGeoCode(address);
    document.querySelector('header').innerHTML = `<h1>Suit your tastes!</h1>`;
    document.getElementById('page1-5').style.display = "block";
    document.getElementById('page1').style.display = "None";
}


function doGeoCode(address) {
    // Get geocoder instance
    var geocoder = new window.google.maps.Geocoder();
    console.log(geocoder)
    // Geocode the address
    geocoder.geocode({
      'address': address
    }, function(results, status) {
      if (status === google.maps.GeocoderStatus.OK && results.length > 0) {
  
        // set it to the correct, formatted address if it's valid
        address = results[0].formatted_address;;
  
        // show an error if it's not
      } else alert("Invalid address");
    });
  };

////////////////////////
// page 1.5 functions //
////////////////////////
let restOrCafe;

function restChoice(bool) {
    restOrCafe = (bool === 'true');
    document.getElementById('page1-5').style.display = "None";
    document.getElementById('page2').style.display = "block";
    if(restOrCafe) { // show go back, cafe button
        document.getElementById('goBackButton').innerHTML = "Wait, I want to search for cafes instead!"
        document.querySelector('.heading-restaurant').style.display = "block";
    } else { // show go back, restaurant button
        document.getElementById('goBackButton').innerHTML = "Wait, I want to search for restaurants instead!"
        document.querySelector('.heading-cafe').style.display = "block";
    }
}

const goBackAddress = () => {
    document.querySelector('header').innerHTML = `<h1>Evanston Food Finder: What should you eat or drink in Evanston?</h1>`;
    document.getElementById('page1-5').style.display = "None";
    document.getElementById('page1').style.display = "block";
}

//////////////////////
// page 2 functions //
//////////////////////

let tags = []

function hasWhiteSpace(str) {
    return str.indexOf(' ') >= 0;
}

function createCookie(name,value,days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();
    }
    else var expires = "";
    document.cookie = name + "=" + value + expires + "; path=/";
}

let res_locations = [];
let res_names = [];
let res_prices = [];
let res_ratings = [];
let res_tags = [];

// works
function parseFetchResult(res) {
    for(let i = 0; i < res.length; i++) {
        res_locations.push(res[i].location);
        res_names.push(res[i].name);
        res_prices.push(res[i].price);
        res_ratings.push(res[i].rating);
        res_tags.push(res[i].tags);
    }
}

const searchButtonPress = () => {
    if(tags.length == 0) {
        if(restOrCafe) {
            fetch('http://localhost:8081/restaurants')
            .then(response => response.json())
            .then(res => {
                //createCookie("res", JSON.stringify(JSON.parse(res)), 1);
                parseFetchResult(res);
            })
        } else {
            fetch('http://localhost:8081/cafes')
            .then(response => response.json())
            .then(res => {
                parseFetchResult(res);
            })
        }
    } else {
        let requestString = "";
        for(let i = 0; i < tags.length; i++) {
            if(hasWhiteSpace(tags[i])) {
                split_tags = tags[i].split(" ");
                requestString += split_tags[0] + "%20" + split_tags[1];
            } else {
                requestString += tags[i];
            }
            // if there is a space in tags[i], insert %20
            if(i != tags.length - 1) { // add a comma
                requestString += ","
            }
        }
        if(restOrCafe) {
            fetch('http://localhost:8081/restaurants?tags=' + requestString)
            .then(response => response.json())
            .then(res => {
                console.log(res);
                parseFetchResult(res);
            })
        } else {
            fetch('http://localhost:8081/cafes?tags=' + requestString)
            .then(response => response.json())
            .then(res => {
                parseFetchResult(res);
            })
        }
    }
    document.getElementById('page2').style.display = "";
    document.getElementById('page3').style.display = "block";
    displayGrid();

    // add_st = `{"exists": "true"}`;
    // createCookie("exists", JSON.stringify(JSON.parse(add_st)), 1)
    // if(address != "") {
    //     loc_string = `{"location": "${address}"}`;
    //     createCookie("loc", JSON.stringify(JSON.parse(loc_string)), 1);
    //     //document.cookie = 'loc=' + JSON.stringify(JSON.parse(loc_string));
    // }
    // window.location.href = "page3.html"
}

const menuButtonPress = () => {
    if(restOrCafe) { // restaurant
        if(document.querySelector('.menu-content-restaurant').style.display === "") {
            // need to fix this
            document.querySelector('.menu-content-restaurant').style.display = "block";
        } else {
            document.querySelector('.menu-content-restaurant').style.display = "";
        }
    } else { // cafe    
        if(document.querySelector('.menu-content-cafe').style.display === "") {
            // need to fix this
            document.querySelector('.menu-content-cafe').style.display = "block";
        } else {
            document.querySelector('.menu-content-cafe').style.display = "";
        }
    }
}

const goBackChoice = () => {
    document.getElementById('page1-5').style.display = "block";
    document.getElementById('page2').style.display = "";
    document.querySelector('.heading-cafe').style.display = "";
    document.querySelector('.heading-restaurant').style.display = "";
    document.querySelector('.menu-content-cafe').style.display = "";
    document.querySelector('.menu-content-restaurant').style.display = "";
    document.getElementById('tag buttons').innerHTML = "";
    tags = [];
}

// TO-DO: add x's to the buttons
function addTag(tag) {
    if(!tags.includes(tag)) {
        tags.push(tag)
        document.getElementById('tag buttons').innerHTML += `<button class="btn" id="${tag}" onclick="removeTag('${tag}')">${tag}</button>`
    }
}

function removeTag(tag) {
    // remove tag from tags
    tags.splice(tags.indexOf(tag), 1);
    console.log(tags);
    // remove the button
    const elem = document.getElementById(tag);
    elem.parentNode.removeChild(elem);

}

//////////////////////
// page 3 functions //
//////////////////////

const reSearchPress = () => {
    res_locations = [];
    res_names = [];
    res_prices = [];
    res_ratings = [];
    res_tags = [];
    document.getElementById('page2').style.display = "block";
    document.getElementById('page3').style.display = "";
    document.getElementById('results').innerHTML = "";
}