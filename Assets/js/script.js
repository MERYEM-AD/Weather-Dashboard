const apiKey='306c135784d264ca0cd3b4fe2ba8c629';
const searchFormEl = document.querySelector('#search-form');
const CityWeatherDay = document.querySelector('#CityWeatherDay');




function handleSearchFormSubmit(event) {
  event.preventDefault();
  let searchInput= document.querySelector('#search-input');
  const searchInputVal = document.querySelector('#search-input').value;

  let weatherlRequest = 'https://api.openweathermap.org/data/2.5/weather?q=' +searchInputVal+ '&appid=' +apiKey;

  if (!searchInputVal) {
    console.error('You need a search input value!');
    return;
  }


  CityWeatherDay.textContent="";
   DisplayWeatherDay(weatherlRequest);
   


  searchInput.value=null;
}



////DISPLAY WEATHER OF CITY INPUT 

function DisplayWeatherDay(urlRequest){

  
 fetch(urlRequest)
 .then(function(response){

  if(response.status===200){

    return response.json();
  }

 })
 .then( function(data){

// console.log(data);
    let cityname = document.createElement('ul');
    cityname.textContent=data.name;

    CityWeatherDay.append(cityname);

    let icon =document.createElement('img');
    let temperature =document.createElement('li');
    let humidity =document.createElement('li');
    let windSpeed =document.createElement('li');
    let uvIndex =document.createElement('li');

   let date = data.dt*1000;
   const dateObject = new Date(date);
   const humanDateFormat = dateObject.toLocaleString("en-US",{day: "numeric",year :"numeric", month : "numeric"
  
  }) ;
    icon.setAttribute("src","https://openweathermap.org/img/w/"+data.weather[0].icon+".png");

  /**Convert Kelvin to Fahrenheit
     
  The temperature T in degrees Fahrenheit (°F) is equal to the temperature T in Kelvin (K) times 9/5, minus 459.67:
         T(°F) = T(K) × 9/5 - 459.67
 */
    let temp =data.main.temp; 
    temperature.textContent= "Temperature :"+(temp*9/5 - 459.67).toFixed(2)+" °F";  //toFixed(2) to  show 2 numbers after decimal  places
    humidity.textContent="Humidity :"+data.main.humidity+" %";
    windSpeed.textContent="wind :"+data.wind.speed+ "MPH";
    
    let lat = data.coord.lat;
    let lon = data.coord.lon;
   let uvRequest = "https://api.openweathermap.org/data/2.5/uvi?lat="+lat+"&lon="+lon+"&appid="+apiKey; 

    cityname.append(" ( "+humanDateFormat+" )");
    cityname.append(icon);
    cityname.append(temperature);
    cityname.append(humidity);
    cityname.append(windSpeed);
    cityname.append(uvIndex);


   fetch(uvRequest)
 
   .then(function(response){

    if(response.status===200){
      return response.json();
    }
  
   })
   .then( function(data){
        uvIndex.textContent="UV index :"+data.value;
   })


 })

}





searchFormEl.addEventListener('submit', handleSearchFormSubmit);




