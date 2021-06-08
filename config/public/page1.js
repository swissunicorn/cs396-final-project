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
            document.querySelector('.menu-content-restaurant').style.display = "flex";
        } else {
            document.querySelector('.menu-content-restaurant').style.display = "";
        }
    } else { // cafe    
        if(document.querySelector('.menu-content-cafe').style.display === "") {
            // need to fix this
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
        document.getElementById('tag buttons').innerHTML += `<button class="btn" id="${tag}" onclick="removeTag('${tag}')">${tag}</button>`
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

let result_array = [];

function parseFetchResult(res, callback) {
    if(res.length == 0) {
        str = "";
        if(restOrCafe) {
            str = "restaurants";
        } else {
            str = "cafes";
        }
        document.getElementById('no results').innerHTML += `<p>There are no ${str} that contain all those tags. Try searching again.</p>`
    }
    else {
        for(let i = 0; i < res.length; i++) {
            //     dest = makeDestinationString(res[i].location);
            //     origin = address_str;
            //     console.log(origin)
            //     console.log(dest)
            //     distance = callDistanceAPI(origin, dest);
            //     res_distances.push(distance);
            result_array.push([res[i].location, res[i].name, res[i].price, res[i].rating, res[i].tags])
        }
        console.log(result_array);
        callback();
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
    tags = []
    document.getElementById('page2').style.display = "block";
    document.getElementById('tag buttons').innerHTML = "";
    document.getElementById('page3').style.display = "";
    document.getElementById('results').innerHTML = "";
}

const displayGrid = () => {
    for(let i = 0; i < result_array.length; i++) {
        document.getElementById('results').innerHTML += makeJSON(result_array[i]);
    }
}

// result_array.push([res[i].location, res[i].name, res[i].price, res[i].rating, res[i].tags])
// [0]: location, [1]: name, [2]: price, [3]: rating, [4]: tags

function makeJSON(rescaf) {
    res_string = `<section>`;
    res_string += `<h2> ${rescaf[1]} </h2>`;
    res_string += `<p> ${rescaf[0]} </p>`;
    res_string += `<p> ${rescaf[3]} </p>`;
    res_string += `<p> ${rescaf[2]} </p>`;
    tag_string = "";
    for(let i = 0; i < rescaf[4].length; i++) {
        tag_string += rescaf[4][i] + ", ";
    }
    tag_string = tag_string.substring(0, tag_string.length - 2);
    res_string += `<p> tags: ${tag_string} </p>`;
    res_string += `</section>`;
    return res_string;
}

// TODO: make pretty CSS
// fetch pictures from google places API
// implement sorting