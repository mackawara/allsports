const axios = require("axios");
const rapidApiKey = process.env.X_RAPID_API_KEY;
const fixtureModel = require("../models/fixture");
const moment = require("moment");
var date = moment();
var currentDate = date.format("YYYY-MM-D");
/* only queries fixutres and scores for current */

const callFootballApi = async () => {
  console.log("call fotball called");
  const options = {
    method: "GET",
    url: `https://api-football-v1.p.rapidapi.com/v3/fixtures`,
    params: {
      league: "1",
      season: "2022",
      date: currentDate,
      timezone: "Africa/Harare",
    },
    headers: {
      "X-RapidAPI-Key": rapidApiKey,
      "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
    },
  };

  const results = await axios
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
  //console.log(results.length);
  results.forEach((element) => {
    const time = new Date(
      element.fixture.timestamp * 1000
    ).toLocaleTimeString();
    const fixtureID = element.fixture.id;
    const venue = element.fixture.venue.name;
    const home = element.teams.home.name;
    const away = element.teams.away.name;
    const competition = `${element.league.name} ${element.league.season}`;
    const goals = element.goals;
    const matchStatus = element.fixture.status.long;
    const score = `${home} ${goals.home} vs ${goals.away} ${away}`;

    const fixture = new fixtureModel({
      // header: competition,
      matchStatus: matchStatus,
      fixture: `${home} vs ${away}`,
      venue: venue,
      date: date,
      home: home,
      away: away,
      time: time,
      score: score,
      fixtureID: fixtureID,
      competition: competition,
    });
    const queryAndSave = async function () {
      console.log(`query Fixture is working`);
      const result = await fixtureModel
        .find({
          fixtureID: fixtureID,
        })
        .exec();
      console.log("result ="+result);

      if (result.length < 1) {
        console.log(" fixture not found");
        fixture.save();
      } else {
        //fixture.matchStatus = matchStatus;
        //fixture.score = score;
        console.log("fixture found now updating");
        fixture.updateOne({matchStatus:matchStatus,score:score}).exec();
      }
    };

    queryAndSave();
  });
};

module.exports = callFootballApi;
