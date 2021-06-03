//////////////////////
// page 1 functions //
//////////////////////

let address;

const goButtonPress = () => { // probably need to make this into a function with input
    // check if the address is valid
    // save the address
    // if there is no address, or the address is invalid, you just can't sort anything. Make that work
    // and you won't be able to calculate distance or display it

    document.querySelector('header').innerHTML = `<h1>Suit your tastes!</h1>`;
    document.getElementById('page1-5').style.display = "block";
    document.getElementById('page1').style.display = "None";
}

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

// TO-DO: make a cookie with the results of fetch and pass it to page 3
const searchButtonPress = () => {
    if(tags.length == 0) {
        if(restOrCafe) {
            fetch('http://localhost:8081/restaurants')
            .then(response => response.json())
            .then(res => {
                console.log(res);
            })
        } else {
            fetch('http://localhost:8081/cafes')
            .then(response => response.json())
            .then(res => {
                console.log(res);
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
            })
        } else {
            fetch('http://localhost:8081/cafes?tags=' + requestString)
            .then(response => response.json())
            .then(res => {
                console.log(res);
            })
        }
    }
    //window.location.href = "page3.html"
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
}

// TO-DO: make little buttons for the tags, and make it so tags get removed from the array when clicked on
function addTag(tag) {
    if(!tags.includes(tag)) {
        tags.push(tag)
    }
    console.log(tags)
    // display the selected tag as a button with an x on it that can be deleted
    // 
}
