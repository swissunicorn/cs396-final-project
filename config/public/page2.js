const baseURL = 'http://localhost:8081'

const searchButtonPress = () => {
    // save the tags I guess
    // make a get request with them
    // save the results

    // go to the next page
    window.location.href = "page3.html"
}

const initScreen = () => {
    document.querySelector('main').innerHTML += `<button class="btn" id="search" onclick="searchButtonPress()">Search</button>`
}

initScreen();