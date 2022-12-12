const axios = require("axios");
const rapidApiKey = process.env.X_RAPID_API_KEY;
const fixtureModel = require("../models/fixture");
const moment = require("moment");
var todayDate = new Date().toISOString().slice(0, 10);

/* only queries fixutres and scores for current */

const callFootballApi = async () => {
  console.log("call foor ball")
  const options = {
    method: "GET",
    url: `https://api-football-v1.p.rapidapi.com/v3/fixtures`,
    params: {
      league: "1",
      season: "2022",
      date: "2022-12-10",
      timezone: "Africa/Harare",
    },
    headers: {
      "X-RapidAPI-Key": rapidApiKey,
      "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
    },
  };

  const matchStatusFormatter = (matchStatus) => {
    if (
      matchStatus.long == "Not Started" ||
      matchStatus.short == "FT"
    ) {
      return matchStatus.long;
    } else {
      return `${matchStatus.elapsed} minutes played`;
    }
  };
  const results = await axios
    .request(options)
    .then((response) => {
      //console.log(response);
      return response.data.response;
      //return data;
    })
    .catch(function (error) {
      console.error(error);
    });
  console.log(results[0].fixture.status)
  try {
    results.forEach(async (result) => {
      const time = new Date(
        result.fixture.timestamp * 1000
      ).toLocaleTimeString();
      const fixtureID = result.fixture.id;
      const venue = result.fixture.venue.name;
      const home = result.teams.home.name;
      const away = result.teams.away.name;
      const competition = `${result.league.name} ${result.league.season}`;
      const goals = result.goals;
      const matchStatus = matchStatusFormatter(result.fixture.status);
      const score = `${home} ${result.goals.home} vs ${result.goals.away} ${away}`;

      const fixture = new fixtureModel({
        // header: competition,
        matchStatus: matchStatus,
        fixture: `${home} vs ${away}`,
        venue: venue,
        date: todayDate,
        home: home,
        away: away,
        time: time,
        score: score,
        fixtureID: fixtureID,
        competition: competition,
      });

      const queryAndSave = async function () {
        const result = await fixtureModel
          .find({
            fixtureID: fixtureID,
          })
          .exec();

        if (result.length < 1) {
          console.log(" not found");
          fixture.save().then(() => console.log("now saved"));
        } else {
          console.log("fixture  ofound now updatung");
        fixtureModel.findOneAndUpdate({fixtureID:fixtureID},{matchStatus:matchStatus,score:score},(error,data)=>{
          if (error){
            console.log(error)
          }
          else{
            console.log(data)
          }
        })

          // fixture.updateOne ({ score: "testing" }).then(()=>console.log("updated"));
          // fixture.save()
          /* fixtureModel.updateOne(
            { fixtureID: fixtureID },
            { matchStatus: matchStatus, score: score, time: time }
          ); */
        }
      };
      queryAndSave();
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = callFootballApi;
