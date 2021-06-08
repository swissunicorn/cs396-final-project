//////////////////////
// page 1 functions //
//////////////////////

let address; // make them just enter a street name bc we assume it's Evanston
let address_str = ""; 

const goButtonPress = () => {
    if(!document.getElementById("location").value) {
        address = "";
    }
    else {
        address = document.getElementById("location").value + ", Evanston, IL, 60201";
        split_strs = document.getElementById("location").value.split(" ");
        for(let i = 0; i < split_strs.length; i++) {
            address_str += split_strs[i] + "+";
        }
        address_str += "Evanston+IL";
        document.getElementById('choice').innerHTML += `<p> Address: "${address}" </p>`;
    }
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

var res_locations = [];
var res_names = [];
var res_prices = [];
var res_ratings = [];
var res_tags = [];
var res_distances = [];

const searchButtonPress = () => {
    if(tags.length == 0) {
        if(restOrCafe) {
            fetch('http://localhost:8081/restaurants')
            .then(response => response.json())
            .then(res => {
                //createCookie("res", JSON.stringify(JSON.parse(res)), 1);
                parseFetchResult(res, displayGrid);
            })
        } else {
            fetch('http://localhost:8081/cafes')
            .then(response => response.json())
            .then(res => {
                parseFetchResult(res, displayGrid);
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
                parseFetchResult(res, displayGrid);
            })
        } else {
            fetch('http://localhost:8081/cafes?tags=' + requestString)
            .then(response => response.json())
            .then(res => {
                parseFetchResult(res, displayGrid);
            })
        }
    }
    document.getElementById('page2').style.display = "";
    document.getElementById('page3').style.display = "block";
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

function callDistanceAPI(origin, dest) {
    fetch('http://localhost:8081/key')
        .then(response => response.json())
        .then(key => {
            console.log(key)
            console.log(key.key)
            let url = 'https://maps.googleapis.com/maps/api/distancematrix/json?origins=' + origin + '&destinations=' + dest + '&key=' + key.key + '&units=imperial';
            fetch(url)
            .then(response => response.json())
            .then(data => {
                // idk man
                console.log(data[0])
                console.log(data[0][0])
                return data;
            })
        })
}

function parseFetchResult(res, callback) {
    for(let i = 0; i < res.length; i++) {
        // this is not ideal. but since this is a data object idk how to deal with it
        // it would be best if there were a list or something of these objects and I could access them
        // it would make sorting easier at least
        res_locations.push(res[i].location);
        res_names.push(res[i].name);
        res_prices.push(res[i].price);
        res_ratings.push(res[i].rating);
        res_tags.push(res[i].tags);
        dest = makeDestinationString(res[i].location);
        origin = address_str;
        console.log(origin)
        console.log(dest)
        distance = callDistanceAPI(origin, dest);
        res_distances.push(distance);
    }
    callback();
}

function makeDestinationString(dest) {
    split_strs_a = dest.split(", ")
    split_strs = split_strs_a[0].split(" ");
    let res = "";
    for(let i = 0; i < split_strs.length; i++) {
        res += split_strs[i] + "+";
    }
    res += "Evanston+IL";
    return res;
}

const reSearchPress = () => {
    res_locations = [];
    res_names = [];
    res_prices = [];
    res_ratings = [];
    res_tags = [];
    tags = [];
    document.getElementById('page2').style.display = "block";
    document.getElementById('active tags').innerHTML = "";
    document.getElementById('page3').style.display = "";
    document.getElementById('results').innerHTML = "";
}

const displayGrid = () => {
    for(let i = 0; i < res_names.length; i++) {
        document.getElementById('results').innerHTML += makeJSON(res_names[i], res_locations[i], res_tags[i], res_ratings[i], res_prices[i]);
    }
}

function makeJSON(name, loc, tags, rating, price) {
    res_string = `<section>`;
    res_string += `<h2> ${name} </h2>`;
    res_string += `<p> ${loc} </p>`;
    res_string += `<p> ${rating} </p>`;
    res_string += `<p> ${price} </p>`;
    tag_string = "";
    for(let i = 0; i < tags.length; i++) {
        tag_string += tags[i] + ", ";
    }
    tag_string = tag_string.substring(0, tag_string.length - 2);
    res_string += `<p> tags: ${tag_string} </p>`;
    res_string += `</section>`;
    return res_string;
}

// TODO: make pretty CSS
// fetch pictures from google places API
// implement sorting