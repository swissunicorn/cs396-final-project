// page 1 functions

let address;

const goButtonPress = () => { // probably need to make this into a function with input
    // check if the address is valid

    // save the address
    // if there is no address, or the address is invalid, you just can't sort anything. Make that work

    document.querySelector('header').innerHTML = `<h1>Suit your tastes!</h1>`;
    document.getElementById('page1-5').style.display = "block";
    document.getElementById('page1').style.display = "None";
}


// page 1.5 functions

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


// page 2 functions

let tags = []

const searchButtonPress = () => {
    // save the tags I guess
    // make a get request with them
    // save the results

    // go to the next page
    window.location.href = "page3.html"
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
    // go back to page 1.5 to re-choose restaurant or cafe
    document.getElementById('page1-5').style.display = "block";
    document.getElementById('page2').style.display = "";
    document.querySelector('.heading-cafe').style.display = "";
    document.querySelector('.heading-restaurant').style.display = "";
    document.querySelector('.menu-content-cafe').style.display = "";
    document.querySelector('.menu-content-restaurant').style.display = "";
}

// https://www.w3schools.com/tags/att_input_type_checkbox.asp

function addTag(tag) {
    // add tag to an array
    // when search is pushed, the array should be sent and turned into a JSON format string
    if(!tags.includes(tag)) {
        console.log(tag)
        tags.push(tag)
    }
    // display the selected tag as a button with an x on it that can be deleted
    // 
}
