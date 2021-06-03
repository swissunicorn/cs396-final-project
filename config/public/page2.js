const baseURL = 'http://localhost:8081'

let tags = []

const searchButtonPress = () => {
    // save the tags I guess
    // make a get request with them
    // save the results

    // go to the next page
    window.location.href = "page3.html"
}

const menuButtonPress = () => {
    console.log("hello 2")
    if(document.querySelector('.menu-content').style.display === "") {
        console.log("hello")
        document.querySelector('.menu-content').style.display = "block";
    } else {
        document.querySelector('.menu-content').style.display = "";
    }
}

// https://www.w3schools.com/tags/att_input_type_checkbox.asp

function addTag(tag) {
    // add tag to an array
    // when search is pushed, the array should be sent and turned into a JSON format string
    if(!tags.includes(tag)) {
        tags.push(tag)

    }
    // display the selected tag as a button with an x on it that can be deleted
    // 
}


const initScreen = () => {
    document.querySelector('main').innerHTML += `<button class="btn" id="search" onclick="searchButtonPress()">Search</button>`
}

initScreen();