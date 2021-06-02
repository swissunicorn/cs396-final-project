const goButtonPress = () => {
    // check if the address is valid

    // save the address somehow

    // go to the next page
    window.location.href = "page2.html"
}

const initScreen = () => {
    document.querySelector('main').innerHTML += `<button class="btn" id="go" onclick="goButtonPress()">Go!</button>`
}

initScreen();