const apiKey='306c135784d264ca0cd3b4fe2ba8c629';
const currentDate = moment();
let searchFormEl = document.querySelector('#search-form');

function handleSearchFormSubmit(event) {
  event.preventDefault();

  let searchInputVal = document.querySelector('#search-input').value;

  if (!searchInputVal) {
    console.error('You need a search input value!');
    return;
  }

  let weatherlRequest = 'https://api.openweathermap.org/data/2.5/weather?q=' + searchInputVal + '&appid=' +apiKey;

 fetch(weatherlRequest)
 .then(function(response){

  if(response.status===200){
  //  console.log(response);
    return response.json();
  }

 })
 .then( function(data){
  console.log(data);

    let cityname = document.createElement('ul');
    cityname.textContent=data.name;

    document.body.append(cityname);

    let icon =document.createElement('img');
    let temperature =document.createElement('li');
    let humidity =document.createElement('li');
    let windSpeed =document.createElement('li');
    let uvIndex =document.createElement('li');

    let date = currentDate.textContent="( "+moment().format('DD/MM/YYYY')+" )";
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

    cityname.append(date);
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
     console.log(data.value);
        uvIndex.textContent="UV index :"+data.value;
 
   })


 })



 
    


}

searchFormEl.addEventListener('submit', handleSearchFormSubmit);
