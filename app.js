const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const moment = require("moment");
//const routes = require('./routes');
require("dotenv").config();

app.use(bodyParser.json());
app.use(express.static(`${__dirname}/public`));
/* All sports  */
const allSportsPageID = process.env.ALLSPORTS_PAGE_ID;
const pageID = process.env.ALLSPORTS_ID;
const connectDB = require("./config/database");

var date = moment();
var currentDate = date.format("YYYY-MM-D");

//routes(app);
const PORT = process.env.PORT || 3001;

module.exports = connectDB;
const sendWhatsapp = require("./config/sendWhatsapp");

const axios = require("axios");

const rapidApiKey = process.env.X_RAPID_API_KEY;
const options = {
  method: "GET",
  url: "https://api-football-v1.p.rapidapi.com/v3/fixtures",
  params: {
    league: "1",
    season: "2022",
    round: "Group Stage - 1",
    date: currentDate,
  },
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
const optionsGetLeague = {
  method: "GET",
  url: "https://api-football-v1.p.rapidapi.com/v3/leagues",
  params: { country: "world", season: "2022" },
  headers: {
    "X-RapidAPI-Key": rapidApiKey,
    "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
  },
  /* params: { live: "all", league: "39" }, */
};
app.get("/getleagues", async (req, res) => {
  const leagues = await axios
    .request(optionsGetLeague)
    .then((response) => {
      data = response.data;
      // console.log(data.response);
      return data.response;
    })
    .catch(function (error) {
      console.error(error);
    });

  res.send(leagues);
});

let pageToken, tasks;

/* Verfiy Whatsapp to receive messages */
app.get("/watsapp", (req, res) => {
  console.log(req.body);
  /**
   * UPDATE YOUR VERIFY TOKEN
   *This will be the Verify Token value when you set up webhook
   **/
  const verify_token = process.env.WHATSAPP_VERIFY_TOKEN;

  // Parse params from the webhook verification request
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  // Check if a token and mode were sent
  if (mode && token) {
    // Check the mode and token sent are correct
    if (mode === "subscribe" && token === verify_token) {
     
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});


app.get("/api", (req, res) => {
  console.log("pinged by react");
  res.json({ message: "Hello from server!" });
});
app.get("/getScores", async (req, res) => {
  console.log("get scores pinged");
  const fixtures = await axios
    .request(options)
    .then((response) => {
     // console.log(response.data);
      data = response.data;
     // console.log(data.response);
      return data.response;
    })
    .catch(function (error) {
      console.error(error);
    });

  const fixture = fixtures[0];
fixtures.forEach((fixture) => {
  console.log(fixture)
  const time = new Date(fixture.fixture.timestamp * 1000).toLocaleTimeString();
  const date = new Date(fixture.fixture.date).toLocaleDateString();
  const venue = fixture.fixture.venue.name;
  const home = fixture.teams.home.name;
  const away = fixture.teams.away.name;
  const competition = `${fixture.league.name} ${fixture.league.season}`;
  const goals = fixture.goals;
  const matchStatus = fixture.fixture.status;
  const scores = `${home} ${goals.home} vs ${goals.away} ${away}`;
  const messageObj = {
    header: competition,
    matchStatus: matchStatus,
    fixture: `${home} vs ${away}`,
    venue: venue,
    date: date,
    time: time,
    score: scores,
    // score:fixture.score.fulltime
  };
  //const messageBody = `${competition} \n${date} ${time} \n${scores} \n${venue}`;

  sendWhatsapp(263775231426, messageObj);
  });
  
  res.send({ body: "tes 1 2" });
});
app.get("/", (req, res) => {
  res.send({ body: "Heelo sports" });
});
//sendWhatsapp(263775231426,"hesi")
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}!`);
});
