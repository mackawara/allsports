const express = require("express");
const bodyParser = require("body-parser");
const app = express();
//const routes = require('./routes');
require("dotenv").config();

app.use(bodyParser.json());
app.use(express.static(`${__dirname}/public`));
/* All sports  */
const allSportsPageID = process.env.ALLSPORTS_PAGE_ID;
const pageID = process.env.ALLSPORTS_ID;
const connectDB = require("./config/database");

//routes(app);
const PORT = process.env.PORT || 3001;
/* connectDB().then(() => {
  
  });
 */
module.exports = connectDB;
const sendWhatsapp=require("./config/sendWhatsapp")

const axios = require("axios");
let date = new Date(),
  today = date
    .toLocaleString()
    .split(",")[0]
    .replace("/", "-")
    .replace("/", "-");
console.log(today);
const rapidApiKey = process.env.X_RAPID_API_KEY;
const options = {
  method: "GET",
  url: "https://api-football-v1.p.rapidapi.com/v3/fixtures",
  params: { league: "39", season: "2022", date: "2022-11-13" },
  headers: {
    "X-RapidAPI-Key": rapidApiKey,
    "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
  },
  /* params: { live: "all", league: "39" }, */
};

//"https://graph.facebook.com/{your-user-id}/accounts?access_token={user-access-token}
const options2 = {
  method: "get",
  url:
    "https://graph.facebook.com/" +
    5632068726880896 +
    "/accounts?access_token=EAAJwHbsiZA7sBAOs1qrpPmDZB0GdyeMyXJEVVYVe4ZCpQYdCINq30NzmGSIqBt7OZAkg09CqplOWKnXwxxI9abBR8iXI7jOMjN3gM6J6LMPmZCUTowUN0vgpvIjWLnWc6Wyv9EqSEzlzm3BAZCt4bZBohVNebljKpKH9vEb6IFFSxErSbUGpvJXMwbXyaIByZCuIH7dZCYTHSVZCKlZBPeqvzvP2FBO3mTaOzuOr2JnHsfdaq0ZAvOgJFGxcWfQkQEdXhwEZD",
};

//today=`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
let pageToken, tasks;
/* axios
  .request(options2)
  .then(function (response) {
    pageToken = JSON.stringify(response.data.data[0].access_token);
    tasks = JSON.stringify(response.data.data[0].tasks);
    console.log(pageToken);
    console.log(tasks);
  })
  .catch(function (error) {
    console.error(error);
  });
 */
/* 
axios.request(options).then(function (response) {
  console.log(response)
	scores=JSON.stringify(response.data.response) 
  scores.forEach(scores=> { 
  });
  console.log(typeof(scores))
}).catch(function (error) {
	console.error(error);
}); 
 */
app.get("/api", (req, res) => {
  console.log("pinged by react");
  res.json({ message: "Hello from server!" });
}); 
app.get("/getScores", async (req, res) => {
 
  const scores = await axios
    .request(options)
    .then((response) => {
     data = response.data;
      console.log(data.response);
      // console.log("scores"+scores)
      return data;
    })
    .catch(function (error) {
      console.error(error);
    })

  res.send(scores);
  const fixtures1=scores.response[0]
  console.log(fixtures1)
  const home = fixture1.teams.home,
  away = fixture1.teams.away,
  awayLogo=away.logo,
  homeLogo=home.logo,
  status=fixture1.fixture.status.long,
  venue = fixture1.fixture.venue.name,
  time = new Date(fixture1.fixture.timestamp * 1000).toLocaleTimeString();
  const message=`${home.name} vs${away.name} \n ${venue} \n Time: ${time}, status`
  

});

const responseObj = {
  get: "fixtures",
  parameters: { league: "39", date: "2022-11-13", season: "2022" },
  errors: [],
  results: 2,
  paging: { current: 1, total: 1 },
  response: [
    {
      fixture: {
        id: 868097,
        referee: "C. Kavanagh",
        timezone: "UTC",
        date: "2022-11-13T14:00:00+00:00",
        timestamp: 1668348000,
        periods: { first: null, second: null },
        venue: {
          id: 508,
          name: "The American Express Community Stadium",
          city: "Falmer, East Sussex",
        },
        status: { long: "Not Started", short: "NS", elapsed: null },
      },
      league: {
        id: 39,
        name: "Premier League",
        country: "England",
        logo: "https://media.api-sports.io/football/leagues/39.png",
        flag: "https://media.api-sports.io/flags/gb.svg",
        season: 2022,
        round: "Regular Season - 16",
      },
      teams: {
        home: {
          id: 51,
          name: "Brighton",
          logo: "https://media.api-sports.io/football/teams/51.png",
          winner: null,
        },
        away: {
          id: 66,
          name: "Aston Villa",
          logo: "https://media.api-sports.io/football/teams/66.png",
          winner: null,
        },
      },
      goals: { home: null, away: null },
      score: {
        halftime: { home: null, away: null },
        fulltime: { home: null, away: null },
        extratime: { home: null, away: null },
        penalty: { home: null, away: null },
      },
    },
    {
      fixture: {
        id: 868098,
        referee: "P. Tierney",
        timezone: "UTC",
        date: "2022-11-13T16:30:00+00:00",
        timestamp: 1668357000,
        periods: { first: null, second: null },
        venue: { id: 535, name: "Craven Cottage", city: "London" },
        status: { long: "Not Started", short: "NS", elapsed: null },
      },
      league: {
        id: 39,
        name: "Premier League",
        country: "England",
        logo: "https://media.api-sports.io/football/leagues/39.png",
        flag: "https://media.api-sports.io/flags/gb.svg",
        season: 2022,
        round: "Regular Season - 16",
      },
      teams: {
        home: {
          id: 36,
          name: "Fulham",
          logo: "https://media.api-sports.io/football/teams/36.png",
          winner: null,
        },
        away: {
          id: 33,
          name: "Manchester United",
          logo: "https://media.api-sports.io/football/teams/33.png",
          winner: null,
        },
      },
      goals: { home: null, away: null },
      score: {
        halftime: { home: null, away: null },
        fulltime: { home: null, away: null },
        extratime: { home: null, away: null },
        penalty: { home: null, away: null },
      },
    },
  ],
};
const fixture1 = responseObj.response[1];

const home = fixture1.teams.home,
  away = fixture1.teams.away,
  awayLogo=away.logo,
  homeLogo=home.logo,
  status=fixture1.fixture.status.long
  venue = fixture1.fixture.venue.name,
  time = new Date(fixture1.fixture.timestamp * 1000).toLocaleTimeString();

//console.log(`${venue} at ${time}`);
//console.log(awayLogo)
//console.log(`${home.name} vs ${away.name} Status: ${status}`);
sendWhatsapp("263775231426","test")
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}!`);
});