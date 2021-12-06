const getWeatherByZip= document.querySelector("#zip-button");
const getWeatherByGeo= document.querySelector("#geo-button");
const currentWeather = document.querySelector("#current-weather");
const getWeatherForecast = document.querySelector('#forecast-button')

// ZIP BUTTON
getWeatherByZip.addEventListener("click", () => {
    let ZIP_CODE = document.querySelector("#zip").value                //get input value
    !ZIP_CODE.match(regex) || ZIP_CODE.length !== 5 ?                        //if not numbers and not 5 digits  (using ternary operator)
        alert("Input a number of 5 digits")                                 //any actions on wrong input
        :
        fetch(`http://api.openweathermap.org/data/2.5/weather?zip=${ZIP_CODE},us&units=imperial&appid=${API_KEY}`)
            .then(response => response.json())
            .then(data => displayWeather(data))
})

//  browser’s geolocation BUTTON
getWeatherByGeo.addEventListener("click", () => {
    const success = position => {
        const latitude  = position.coords.latitude
        const longitude = position.coords.longitude
        console.log(`Latitude: ${latitude} °, Longitude: ${longitude} °`)
        fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`)
            .then(response => response.json())
            .then(data => displayWeather(data))

    }
    const error = () => {
        console.log('Unable to retrieve your location')
        currentWeather.insertAdjacentHTML('beforeend', 'Unable to retrieve your location');
    }
    if(!navigator.geolocation) {
        currentWeather.insertAdjacentHTML('beforeend', 'Geolocation is not supported by your browser');
    } else {
        currentWeather.innerHTML = ""
        currentWeather.insertAdjacentHTML('beforeend', 'Unable to retrieve your location');
    }
})

const displayWeather = (data) => {
    let weatherDisplay = ""
    if (data.cod !== '404') {                          //if status not 404 make html
        currentWeather.innerHTML = ""                 //delete last html
        let temp = [
            {id : 0,temp: '100',color: '#8c0007'},
            {id : 1,temp:'80',color: '#ff3700'},
            {id : 2,temp:'60',color: '#ffea00'},
            {id : 3,temp:'20',color: '#00ff11'},
            {id : 4,temp:'-32',color: '#008cff'}
        ]
        const closest = (num, arr) => {                             //get the nearest color
            let curr = arr[0].temp
            let diff = Math.abs (num - curr)
            for (let val = 0; val < arr.length; val++) {
                let newdiff = Math.abs (num - arr[val].temp)
                if (newdiff < diff) {
                    diff = newdiff
                    curr = arr[val]
                }
            }
            return curr.color;
        }

        let path = data.weather[0].icon              //get name of picture

        let clouds = ''
        if (data.clouds.all) {   //if rain
             clouds = `<div>
                <span>Clouds:</span> 
                <b>${data.clouds.all} %</b>
             </div>`
        }
        let rain = ''
        if (data.rain) {   //if rain
             rain = `<div>
                <span>Rain:</span> 
                <b>${data.rain[0]}</b>
             </div>`
        }
        let snow = ''
        if (data.snow) {   //if snow
            snow = `<div>
                <span>Snow:</span> 
                <b>${data.snow[0]}</b>
             </div>`
        }
        weatherDisplay =                            //refactored structure. Usage Div-tags instead of p-tags. So code is more clean and readable
            `
            <div>
                <h1>${data.name}</h1>                   
                <h2>${data.weather[0].main}</h2>
                <img src='img/${path}@2x.png' alt=""> 
            </div>
            <div>                        
                <span>Current Temp:</span>
                <b style="color: ${closest (data.main.temp, temp)}" >${data.main.temp} F</b>  <!--set inline style and return here a hex color value-->
             </div>
             <div>
                <span>Feels Like:</span> 
                <b>${data.main.feels_like} F</b>
             </div>
               
             <div> 
                <span>Description:</span>
                <b>${data.weather[0].description}</b>
             </div>`

        currentWeather.insertAdjacentHTML('beforeend', weatherDisplay + snow + rain + clouds);
    }else{                                                                             //if status 404 make another html
        currentWeather.innerHTML = ""
        weatherDisplay = `<h1>Error</h1>`
        currentWeather.insertAdjacentHTML('beforeend', weatherDisplay);
    }
}

getWeatherForecast.addEventListener("click", () => {
    let ZIP_CODE = document.querySelector("#zip").value                //get input value
    !ZIP_CODE.match(regex) || ZIP_CODE.length !== 5 ?                        //if not numbers and not 5 digits  (using ternary operator)
        alert("Input a number of 5 digits")                                 //any actions on wrong input
        :
        fetch(`http://api.openweathermap.org/data/2.5/forecast?zip=${ZIP_CODE}&appid=${API_KEY}`)
            .then(response => response.json())
            .then(data => displayForecast(data))

    function displayForecast (data) {
        let weatherDisplay = ''
        if (data.cod !== '404') {           //if status not 404 make html
            //DATA
            for (i=0;i<40;i += 8 ){  //API for 30 days throws 401, so i used api for 3 days per 40 hours, so we need 5 days => 40/5; iterator = 8, threshold = i<40
                let Getday = new Date(data.list[i].dt_txt).getDay()
                let SetDay = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
                console.log('day:', SetDay[Getday-1]) //index from 0, then - 1
                console.log('date:',new Date(data.list[i].dt_txt).getMonth() +'/'+ new Date(data.list[i].dt_txt).getDay() )
                console.log('min temp:',data.list[i].main.temp_min)
                console.log('max temp:',data.list[i].main.temp_max)
                let path = data.list[i].weather[0].icon
                console.log('img: result in comments' + '; path: ' + path) //<img src="img/${path}@2x.png" alt="">
                console.log('description: ', data.list[i].weather[0].description)
                if (data.list[i].clouds) {             //if clouds
                    console.log('clouds:', data.list[i].clouds.all, '%')
                }
                if (data.list[i].weather[0].rain) {   //if rain
                    console.log(data.list[i].weather[0].rain[0])
                }
                if (data.list[0].weather[0].snow) {   //if snow
                    console.log(data.list[i].weather[0].snow[0])
                }
                //END
                currentWeather.innerHTML = ""                 //delete last html
                weatherDisplay = `<div>just past here layout with all data (all in cosole)</div>`           //here make tables using cycle
                currentWeather.insertAdjacentHTML('beforeend', weatherDisplay);
            }
        }else{                                                                             //if status 404 make another html
            currentWeather.innerHTML = ""
            weatherDisplay = `<h1>Error</h1>`
            currentWeather.insertAdjacentHTML('beforeend', weatherDisplay);
        }
    }
})
















