// search section variable
var cityNameInput = document.querySelector('#city-input')
var searchBtn = document.querySelector('#search')
var searchHistoryEl = document.querySelector('.search-history')

// the current weather section variable
var cityName = document.querySelector('#city-name')
var dateEl = document.querySelector('#date')
var weatherIconEl = document.querySelector('#weather-icon')
var temperatureEl = document.querySelector('#temp')
var windSpeedEl = document.querySelector('#wind-speed')
var humidityEl = document.querySelector('#humidity')
var uvIndexEl = document.querySelector('#uv-index')

// 5-days weather forecast section variable
var dateElement = document.querySelectorAll('.date')
var weatherIcon = document.querySelectorAll('.weather-icon')
var  tempEl= document.querySelectorAll('.temp')
var  windEl= document.querySelectorAll('.wind-speed')
var  humidEl= document.querySelectorAll('.humidity')

// creating an array that will hold the city history
var cityHistory = [] 

//function that get the city history from the local storage
function getCityHistory() {
    var searchHistory = JSON.parse(localStorage.getItem('cityHistory'))
    if(searchHistory){
        cityHistory = searchHistory;
    }
    displayCityHistory();
}

//Creating the function that will store the cityHistory in the local storage.
function saveCityHistory(cityName) {
    // this adds the current infront of the array
    cityHistory.unshift({cityName});

    localStorage.setItem("cityHistory", JSON.stringify(cityHistory)) 
} 

//Creating a function that will make the cityHistory clickable to display content
function clickedCityHistory(event) {
    event.preventDefault();
    
    //calling the geoCoord function and parsing the text content of the cityHistory
    geoCoord(event.target.textContent)
}

//creating a function that displays the cityHistory
function displayCityHistory() {
    //Emptying the search history
    searchHistoryEl.innerHTML = '';

    var historyLength = cityHistory.length
    if(historyLength > 8){
        //assigning the length to be displayed 
        historyLength = 8
    }

    //Looping through the history and making it display only the length provided
    for(var i=0; i < historyLength; i++) {
        //creating the button
        var historyBtn = document.createElement("button");

        // Setting a class attribute to the button
        historyBtn.setAttribute('class', 'btn btn-secondary w-100 mt-3 btn-history');
        
        historyBtn.textContent = cityHistory[i].cityName

        searchHistoryEl.appendChild(historyBtn)
        // Adding eventListener to the history
        historyBtn.addEventListener('click', clickedCityHistory)
    }
}

