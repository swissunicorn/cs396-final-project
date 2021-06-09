//////////////////////
// page 1 functions //
//////////////////////

let address; // make them just enter a street name bc we assume it's Evanston
let address_str = ""; 

const goButtonPress = () => {
    if(!document.getElementById("location").value) {
        address = "";
        document.getElementById('address-input').innerHTML = "";
    }
    else {
        address = document.getElementById("location").value + ", Evanston, IL, 60201";
        split_strs = document.getElementById("location").value.split(" ");
        for(let i = 0; i < split_strs.length; i++) {
            address_str += split_strs[i] + "+";
        }
        address_str += "Evanston+IL";
        document.getElementById('address-input').innerHTML = `<p> Address: "${address}" </p>`;
    }
    // I guess I'm just going to assume that the address is correct
    //doGeoCode(address);
    document.querySelector('header').innerHTML = `<h1>Suit your tastes!</h1>`;
    document.getElementById('page1-5').style.display = "block";
    document.getElementById('page1').style.display = "None";
}

// function doGeoCode(address) {
//     // Get geocoder instance
//     var geocoder = new window.google.maps.Geocoder();
//     console.log(geocoder)
//     // Geocode the address
//     geocoder.geocode({
//       'address': address
//     }, function(results, status) {
//       if (status === google.maps.GeocoderStatus.OK && results.length > 0) {
  
//         // set it to the correct, formatted address if it's valid
//         address = results[0].formatted_address;;
  
//         // show an error if it's not
//       } else alert("Invalid address");
//     });
//   };


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
    address = "";
}

//////////////////////
// page 2 functions //
//////////////////////

let tags = []

function hasWhiteSpace(str) {
    return str.indexOf(' ') >= 0;
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
    if(address == "") { // sort buttons
        document.getElementById('no-address').style.display = "block";
        //document.getElementById('gave-address').style.display = "";
    }
    else {
        document.getElementById('gave-address').style.display = "block";
        //document.getElementById('no-address').style.display = "";
    }
}

const menuButtonPress = () => {
    if(restOrCafe) { // restaurant
        if(document.querySelector('.menu-content-restaurant').style.display === "") {
            document.querySelector('.menu-content-restaurant').style.display = "flex";
        } else {
            document.querySelector('.menu-content-restaurant').style.display = "";
        }
    } else { // cafe    
        if(document.querySelector('.menu-content-cafe').style.display === "") {
            document.querySelector('.menu-content-cafe').style.display = "flex";
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
        // just changed this
        document.getElementById('tag buttons').innerHTML += `<button class="active-tag" id="${tag}" onclick="removeTag('${tag}')">${tag}</button>`
    }
    menuButtonPress();
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

async function callDistanceAPI(origin, dest, restobj, callback) {
    fetch(`http://localhost:8081/distance?origin=${origin}&destination=${dest}`)
        .then(response => response.json())
        .then(data => {
            //return data.msg;
            callback(restobj, data.msg, displayGrid)
        })
}

let result_array = [];
let index = 0;

function res_push(res_obj, distance, callback) {
    result_array.push([res_obj.location, res_obj.name, res_obj.price, res_obj.rating, res_obj.tags, distance])
    callback();
}

function parseFetchResult(res) {
    if(res.length == 0) {
        str = "";
        if(restOrCafe) {
            str = "restaurants";
        } else {
            str = "cafes";
        }
        document.getElementById('no results').innerHTML += `<p>There are no ${str} that contain all those tags. Try searching again.</p>`
    }
    else if(address == "") {
        // no distance calculation
        for(let i = 0; i < res.length; i++) {
            result_array.push([res[i].location, res[i].name, res[i].price, res[i].rating, res[i].tags]);
            displayGrid();
        }
    }
    else {
        for(let i = 0; i < res.length; i++) {
            dest = makeDestinationString(res[i].location);
            origin = address_str;
            callDistanceAPI(origin, dest, res[i], res_push)
        }
    }
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
    result_array = []
    index = 0;
    tags = []
    document.getElementById('page2').style.display = "block";
    document.getElementById('tag buttons').innerHTML = "";
    document.getElementById('page3').style.display = "";
    document.getElementById('results').innerHTML = "";
    document.getElementById('gave-address').style.display = "";
    document.getElementById('no-address').style.display = "";
    document.querySelector('.sort-options1').style.display = "";
    document.querySelector('.sort-options2').style.display = "";
}

const displayGrid = () => {
    document.getElementById('results').innerHTML += makeJSON(result_array[index]);
    index++;
}

const reDisplayGrid = () => {
    document.getElementById('results').innerHTML = "";
    for(let i = 0; i < result_array.length; i++) {
        document.getElementById('results').innerHTML += makeJSON(result_array[i]);
    }
}

// result_array.push([res[i].location, res[i].name, res[i].price, res[i].rating, res[i].tags])
// [0]: location, [1]: name, [2]: price, [3]: rating, [4]: tags, [5]: distance

function makeJSON(rescaf) {
    res_string = `<section>`;
    res_string += `<h2> ${rescaf[1]} </h2>`;
    res_string += `<p> ${rescaf[0]} </p>`;
    res_string += `<p> ${rescaf[3]} ☆</p>`;
    res_string += `<p> ${rescaf[2]} </p>`;
    if(address != "") {
        res_string += `<p> ${rescaf[5]} </p>`;
    }
    // distance
    tag_string = "";
    for(let i = 0; i < rescaf[4].length; i++) {
        tag_string += rescaf[4][i] + ", ";
    }
    tag_string = tag_string.substring(0, tag_string.length - 2);
    res_string += `<p> tags: ${tag_string} </p>`;
    res_string += `</section>`;
    return res_string;
}

function sortByDistance(callback) {
    result_array.sort((a, b) => parseFloat(a[5].substring(0, 3)) - parseFloat(b[5].substring(0, 3)));
    console.log(result_array);
    // can I make it opaque or unclickable?
    callback();
    reDisplayGrid();
}

function sortByRating(callback) {
    result_array.sort((a, b) => parseFloat(b[3]) - parseFloat(a[3]));
    console.log(result_array);
    callback();
    reDisplayGrid();
}

// works
function sortByPrice(callback) {
    result_array.sort((a, b) => a[2].length - b[2].length);
    console.log(result_array);
    callback();
    reDisplayGrid();
}

// I have an issue where 
const sortMenuPress1 = () => {
    if(document.querySelector('.sort-options1').style.display === "") {
        document.querySelector('.sort-options1').style.display = "flex";
    } else {
        document.querySelector('.sort-options1').style.display = "";
    }
}

const sortMenuPress2 = () => {
    if(document.querySelector('.sort-options2').style.display === "") {
        document.querySelector('.sort-options2').style.display = "flex";
    } else {
        document.querySelector('.sort-options2').style.display = "";
    }
}

// make new sorting drop-down that has the current sort grayed-out
// obviously if they have no address, then there is no distance option

// TODO: make pretty CSS (a little more?)
// fetch pictures from google places API
// add stars
// maybe make tags purple?