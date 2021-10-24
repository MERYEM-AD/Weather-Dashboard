const apiKey='306c135784d264ca0cd3b4fe2ba8c629';
const searchFormEl = document.querySelector('#search-form');
const CityWeatherDay = document.querySelector('#CityWeatherDay');
const forcast5= document.querySelector('#FiveDaysforcast');
const DisplaySearchHistory= document.querySelector('#DisplaySearchHistory');
const UnfoundCity = './404.html';


function getFromloalStorage(){


  let citiesNames = localStorage.getItem("newCity");
  if( citiesNames === null){       
       citiesNames = [];
       
      }else{

        let searchTitle = document.createElement("h6"); 
        searchTitle.setAttribute("class","row w-100");
        searchTitle.textContent = "Search History "
        DisplaySearchHistory.append(searchTitle);

        citiesNames = JSON.parse(citiesNames);
        for(let i =((citiesNames.length)-1);i>=0;i--)
           {


            let buttonCityName =document.createElement('button');
            buttonCityName.setAttribute("class","bg-darkblue margin-Top w-100");
            buttonCityName.setAttribute("data-city",(citiesNames[i].name).trim().toUpperCase());
            buttonCityName.textContent=citiesNames[i].name;
            $('.btn-group-vertical').append(buttonCityName);
            buttonCityName.addEventListener('click',BtnHistorySearch);
           }
   

  }    
  return citiesNames;
  
}



let tableHistory = getFromloalStorage();


function handleSearchFormSubmit(event) {
  event.preventDefault();
  let searchInput= document.querySelector('#search-input');
  const searchInputVal = document.querySelector('#search-input').value.trim().toUpperCase();

  let weatherlRequest = 'https://api.openweathermap.org/data/2.5/weather?q=' +searchInputVal+ '&appid=' +apiKey;
  

  if (!searchInputVal) {
    return;
  }

  CityWeatherDay.textContent="";
  forcast5.textContent=""


  fetch(weatherlRequest).then(function(response){

    console.log(response);

      if(response.status===404){

        console.log ("Sorry ,City invalid ");
        document.location.href=UnfoundCity;
        
      }else{

        DisplayWeatherDay(weatherlRequest);
  
        FiveDaysforcast(searchInputVal);

     //create object name

  let CityObject={name :searchInputVal};


   SetCtiyName(tableHistory,CityObject);
  
   DisplaySearchHistory.textContent="";

   getFromloalStorage();
      

      }
  })

   

searchInput.value=null;

}


function SetCtiyName(tableHistory,objectName){

  let tab= tableHistory;
  tab.push(objectName);
  let newCity =JSON.stringify(tab);
  localStorage.setItem("newCity", newCity);
}



////DISPLAY WEATHER OF CITY INPUT 

function DisplayWeatherDay(urlRequest){

  fetch(urlRequest)
 .then(function(response){
    return response.json();
 })
 .then( function(data){

    let cityname = document.createElement('ul');
    cityname.textContent=data.name.toUpperCase();

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

        ///comparison of  Conditions

if (parseInt(data.value) >=1 && parseInt(data.value) <=2){

  uvIndex.setAttribute("class","favorable");

}else if (parseInt(data.value) >=3 && parseInt(data.value)<=5){

  uvIndex.setAttribute("class","moderate");
  
}else{uvIndex.setAttribute("class","severe");}

   })



 
 
 
});

}

//display 5 days forcast
 function FiveDaysforcast(cityname){

let forcastDays = "https://api.openweathermap.org/data/2.5/forecast?q="+cityname+"&appid="+apiKey;

//display with ajax method
$.ajax({
url :forcastDays,
method:'GET',

}).then(function(response){

 for(let i=0;i<=32;i+=8){
 //let date =document.createElement('p');
 let icon =document.createElement('img');
 let temperature =document.createElement('p');
 let humidity =document.createElement('p');
 let windSpeed =document.createElement('p');

//  creation of card

let card = document.createElement('div');
let cardBody = document.createElement('div');

card.setAttribute("class","card margin");
cardBody.setAttribute("class","card-body");


 let date = response.list[i].dt*1000;
 const dateObject = new Date(date);
 const humanDateFormat = dateObject.toLocaleString("en-US",{day: "numeric",year :"numeric", month : "numeric"}) ;

 icon.setAttribute("src","https://openweathermap.org/img/w/"+response.list[i].weather[0].icon+".png");

 let temp =response.list[i].main.temp; 
 temperature.textContent= "Temperature :"+(temp*9/5 - 459.67).toFixed(2)+" °F";  //toFixed(2) to  show 2 numbers after decimal  places
 humidity.textContent="Humidity :"+response.list[i].main.humidity+" %";
 windSpeed.textContent="wind :"+response.list[i].wind.speed+ "MPH";


 icon.setAttribute("class","card-text");
 temperature.setAttribute("class","card-text");
 humidity.setAttribute("class","card-text");
 windSpeed.setAttribute("class","card-text");
 

 cardBody.append(" ( "+humanDateFormat+" )");
 cardBody.append(icon);
 cardBody.append(humidity);
 cardBody.append(temperature);
 cardBody.append(windSpeed);

 card.append(cardBody);
 forcast5.append(card);
 


 }

}



);


  
}


searchFormEl.addEventListener('submit', handleSearchFormSubmit);


////Display weather city and 5 days forcast for each button from search history :

function BtnHistorySearch(event){
   let city = event.target;
   if (city.matches("button")) {

    let datacity = city.getAttribute("data-city");
    
  let weatherlRequest = 'https://api.openweathermap.org/data/2.5/weather?q=' +datacity+ '&appid=' +apiKey;

  CityWeatherDay.textContent="";
  forcast5.textContent=""

  DisplayWeatherDay(weatherlRequest);
  FiveDaysforcast(datacity);



}
}





