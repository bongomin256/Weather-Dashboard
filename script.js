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

//Creating the functio that will handle the inputs
var fetchBtnHandler = function (event) {
    event.preventDefault();

    var searchBtn = event.target.id;

    // storing the value of the inputs in cityName variable
    var cityName = cityNameInput.value.trim()
    
    if (cityName) {
        geoCoord(cityName);
     // Emptying the input
      cityNameInput.value = '';

     //calling the functions below
      saveCityHistory(cityName)
      getCityHistory()
    } else {
      alert('Please enter a city');
    }
};

// My API key
var apiKey = 'dc30aec4d71f2d73ae4aac9f386f984f'

//Geocoding API website
var geoURl = 'http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}'

// creating a function that fetches the coordinates of the citys
var geoCoord = function (cityName) {
   
    var geoApiURl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + cityName + '&limit=5&appid=' + apiKey;
    fetch(geoApiURl)
     .then(function (response) {
      return response.json();
    })
    .then(function (data) {
        var dataAquired = data[0];
        getWeather(dataAquired);
    
     })
};

var oneCallApiUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}'


var getWeather = function(dataAquired) {
    // Storing the Lat coordinates in lat varibale
    var lat = dataAquired.lat

    // Storing the Lon coordinates in lon varibale
    var lon = dataAquired.lon

    // Storing the city name got from the first fetch in varibale called cityNameEl
    var cityNameEl = dataAquired.name 
    
    //One Call Weather API
    var oneCallApiUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&units=imperial&appid=' + apiKey;
    
    fetch(oneCallApiUrl)
     .then(function (response) {
      return response.json();
    })
    .then(function (data) {
        console.log(data)

        var cityNameEl = dataAquired.name 
        cityName.textContent = cityNameEl
        
        //Converting the day time to date
        var date = moment.unix(data.current.dt).format('M/D/YYYY')
        dateEl.textContent = date
        
        // getting the weather icon
        var icon = data.current.weather[0].icon
        weatherIconEl.setAttribute('src', 'http://openweathermap.org/img/wn/' + icon + '.png')

        var humidity = data.current.humidity
        var windSpeed = data.current.wind_speed
        var temperature = data.current.temp
        var uvIndex = data.current.uvi

        temperatureEl.textContent = temperature;
        windSpeedEl.textContent = windSpeed
        humidityEl.textContent = humidity
        

        // adding colors to uv index
        uvIndexEl.textContent = uvIndex
        if (uvIndex < 3) {
            uvIndexEl.setAttribute('style', 'background-color: green; padding:5px 10px; color: white;')
        } else if (uvIndex >=3 &&  uvIndex < 6) {
            uvIndexEl.setAttribute('style', 'background-color: yellow; padding:5px 10px; color: black; ')
        } else if (uvIndex >=6 && uvIndex < 8) {
            uvIndexEl.setAttribute('style', 'background-color: orange; padding:5px 10px; color: white;')
        } else if (uvIndex >=8 && uvIndex < 11) {
            uvIndexEl.setAttribute('style', 'background-color: red; padding:5px 10px; color: white;')
        } else {
            uvIndexEl.setAttribute('style', 'background-color: purple; padding:5px 10px; color: white;')
        }
        
        //5 days forecast loop
        var forecast = data.daily
        for(var i = 0; i < 5; i++) {
            var currentDay = forecast[i]
        
            dateElement[i].textContent = moment.unix(currentDay.dt).format('M/D/YYYY')
            weatherIcon[i].setAttribute('src', 'http://openweathermap.org/img/wn/' + currentDay.weather[0].icon + '.png')
            humidEl[i].textContent = currentDay.humidity
            windEl[i].textContent = currentDay.wind_speed
            tempEl[i].textContent = currentDay.temp.day

        }    
   })
}

// Calling the function always load the page with the history
getCityHistory ();

// Displaying Seattle weather by default.
if (cityHistory.length == 0) {
    geoCoord('seattle')
} else {
    geoCoord(cityHistory[0].cityName)
}

// Adding Eventlistener to the searchBtn
searchBtn.addEventListener('click', fetchBtnHandler)