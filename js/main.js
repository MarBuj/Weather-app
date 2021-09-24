const inputBox = document.querySelector('input');
const searchBtn = document.querySelector('.searchBtn');
const infoMsg = document.querySelector('.infoMsg');
const locationBtn = document.querySelector('.locationBtn');
const backBtn = document.querySelector('.backBtn');

const searchSection = document.querySelector('.search');
const infoSection = document.querySelector('.info');

let api;

// search by entering city name;
searchBtn.addEventListener('click', () => {
    if (inputBox.value != "") {
        requestApi(inputBox.value);
    }
});

// search by getting user device location;
locationBtn.addEventListener('click', () => {
    if (navigator.geolocation) { // if browser support geolocation api;
        // if getCurrentPosition method works > onSuccess function will be called, if not > onError function will be called;
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    } else {
        alert('Sorry, Your browser does not support geolocation api');
    }
});

// request api by user device location;
function onSuccess(position) {
    let apiKey = '8da36084caafbdf7367dd69fe06a27e6';
    console.log(position);
    // getting latitude & longitude of user device from coords object;
    const { latitude, longitude } = position.coords;
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
    fetchData();
}

function onError(error) {
    infoMsg.style.display = 'block';
    infoMsg.innerText = error.message;
    infoMsg.classList.add('list-group-item-danger');
}

// request api by city name;
function requestApi(city) {
    let apiKey = '8da36084caafbdf7367dd69fe06a27e6';
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    fetchData();
}

function fetchData() {
    infoMsg.style.display = 'block';
    infoMsg.innerText = 'Loading weather details...';
    infoMsg.classList.add('list-group-item-success');
    // getting API response and returning it with parsing info JS object;
    // then function calling "weatherDetails" with passing API result as an argument;
    fetch(api).then(response => response.json()).then(result => weatherDetails(result));
}

function weatherDetails(info) {
    if (info.cod == '404') {
        infoMsg.style.display = 'block';
        infoMsg.classList.replace('list-group-item-success', 'list-group-item-danger');
        infoMsg.innerText = 'Specified city was not found';
    } else {
        infoMsg.classList.replace('list-group-item-danger', 'list-group-item-success');
        console.log(info);
        searchSection.style.display = 'none';
        // main properties value from the "info" object;
        const city = info.name;
        const country = info.sys.country;
        const { description, id } = info.weather[0];
        const { feels_like, humidity, temp } = info.main;

        // main properties from info object to HTML;
        const weatherImg = document.querySelector('.weatherImg'); 
        if (id == 800) { // Clear
            weatherImg.src = "img/sun.png"; 
        } else if (id >= 200 && id <= 232) { // Thunderstorm
            weatherImg.src = "img/thunderstorm.png"; 
        } else if (id >= 300 && id <= 321) { // Drizzle
            weatherImg.src = "img/drizzle.png"; 
        } else if (id >= 500 && id <= 531) { // Rain
            weatherImg.src = "img/rain.png"; 
        } else if (id >= 600 && id <= 622) { // Snow
            weatherImg.src = "img/snow.png";
        } else if (id >= 701 && id <= 781) { // Atmosphere
            weatherImg.src = "img/atmosphere.png";
        } else if (id >= 801 && id <= 804) { // Clouds
            weatherImg.src = "img/cloud.png";
        }
        document.querySelector('.temperature').innerText = Math.floor(temp); 
        document.querySelector('.city').innerText = city; 
        document.querySelector('.country').innerText = country; 
        document.querySelector('.weather-description').innerText = description;
        document.querySelector('.feels-like').innerText = Math.floor(feels_like); 
        document.querySelector('.humidity').innerText = humidity;

        infoSection.style.display = 'block';
        backBtn.style.display = 'block';
    }
}

backBtn.addEventListener('click', () => {
    infoSection.style.display = 'none';
    backBtn.style.display = 'none';
    infoMsg.style.display = 'none';
    searchSection.style.display = 'block';
    inputBox.value = '';
});