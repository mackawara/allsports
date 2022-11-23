const axios = require("axios");
const rapidApiKey = process.env.X_RAPID_API_KEY;
const fixtureModel = require("../models/fixture");
/* only queries fixutres and scores for current */
const date = new Date(element.fixture.date).toLocaleDateString();
const callFootballApi = async (endpoint, league) => {
  const options = {
    method: "GET",
    url: `https://api-football-v1.p.rapidapi.com/v3/${endpoint}`,
    params: {
      league: league,
      season: "2022",
      date: currentDate,
      timezone: "Africa/Harare",
    },
    headers: {
      "X-RapidAPI-Key": rapidApiKey,
      "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
    },
  };

  const saveToDB = async (item) => {
    
    console.log(` now saving to DB `);
    model.findOne({fixtureID:fixtureID});
    await item
      .save()
      .then(() => {
        console.log(" successfuly saved");
      })
      .catch((err) => {
        const errors = err.errors;
      });
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

  results.forEach((element) => {
    console.log(element);
    const time = new Date(
      element.fixture.timestamp * 1000
    ).toLocaleTimeString();
    const fixtureID = element.fixture.id;
    const venue = element.fixture.venue.name;
    const home = element.teams.home.name;
    const away = element.teams.away.name;
    const competition = `${element.league.name} ${element.league.season}`;
    const goals = element.goals;
    const matchStatus = element.fixture.status;
    const scores = `${home} ${goals.home} vs ${goals.away} ${away}`;

    const fixture = new fixtureModel({
      header: competition,
      matchStatus: matchStatus,
      fixture: `${home} vs ${away}`,
      venue: venue,
      date: date,
      time: time,
      score: scores,
      fixtureID: fixtureID,
    });
    //check if fixture is already saved in the DB and update scores and match status
    !fixtureModel.findOne({ fixtureID: fixtureID })
      ? fixture.save()
      : fixture.save({ matchStatus: matchStatus, scores: scores });
  });
};
