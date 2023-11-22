const unirest = require("unirest");
const express = require("express");
const bodyText = require("body-parser");

const app = express();
app.use(bodyText.urlencoded({ extended: true })); //To use body parser with post request

//include all static files so we can use CSS
app.use(express.static(__dirname + "/public"));

app.all("/", function (req, res, next) {
  if (
    req.method.toLowerCase() !== "get" &&
    req.method.toLowerCase() !== "post"
  ) {
    return res.sendStatus(405); // Method Not Allowed
  }
  next();
});
//main page
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/public/index.html");
});

// Display the information when there is post request
app.post("/weather", function (request, response) {
  //Get the weather data
  const req = unirest(
    "GET",
    "https://community-open-weather-map.p.rapidapi.com/weather"
  );

  let city = request.body.city;
  // city = city + ", USA"  //Add country if needed

  req.query({
    q: city,
    lang: "en",
    units: "imperial",
  });

  // Update your API keys
  req.headers({
    "x-rapidapi-key": "e4f0b48b60msh436d402da62c33cp1fa03fjsne9acab908726",
    "x-rapidapi-host": "openweather43.p.rapidapi.com",
    useQueryString: true,
  });

  req.end(function (res) {
    if (res.error) {
      if (res.error) throw new Error(res.error);
    } else {
      const weather = res.body;

      response.send(`
  <div class="weather-container">
    <h2 class="city-heading">Current Weather in ${city}</h2>
    <div class="weather-details">
      <p class="temperature">Temperature: ${weather.main.temp} °F</p>
      <p class="description">Description: ${weather.main[0].description}</p>
      <p class="humidity">Humidity: ${weather.main.humidity}%</p>
      
    </div>
  </div>
`);
    }
  });
});

let port = process.env.PORT || 8002;
app.listen(port, function () {
  console.log("Server running on port 8002");
});

module.exports = app;
