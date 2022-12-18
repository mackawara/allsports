const axios = require("axios");
const rapidApiKey = process.env.X_RAPID_API_KEY;
const fixtureModel = require("../models/fixture");
var todayDate = new Date().toISOString().slice(0, 10);

/* only queries fixutres and scores for current */

const callFootballApi = async () => {
  console.log("call football");
  const options = {
    method: "GET",
    url: `https://api-football-v1.p.rapidapi.com/v3/fixtures`,
    params: {
      league: "1",
      season: "2022",
      date: todayDate,
      timezone: "Africa/Harare",
    },
    headers: {
      "X-RapidAPI-Key": rapidApiKey,
      "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
    },
  };

  const matchStatusFormatter = (matchStatus, penalty, winner) => {
    //check if the match is finished or hasnt started
    const inProgress = /1H|2H|HT|ET/;
    const matchFinishedNotStarted = /FT|NS/;
    const afterEtPen = /AET|PEN/;
    if (matchFinishedNotStarted.test(matchStatus.short)) {
      return matchStatus.long;
    } else if (inProgress.test(matchStatus.short)) {
      return `In progress,${matchStatus.long}, ${matchStatus.elapsed} minutes played`;
    } else if (afterEtPen.test(matchStatus.short)) {
      let winningScore =
        penalty.home > penalty.away ? penalty.home : penalty.away;
      let losingScore =
        penalty.home < penalty.away ? penalty.home : penalty.away;

      return `${matchStatus.long} *${winner} won ${winningScore}-${losingScore}*`;
    }
  };
  const scoreFormatter = (score, matchStatus,home,away) => {
    if (matchStatus == "Match Finished") {
      return `Full time ${score}`;
    } else if (matchStatus == "Not Started") {
      return `${home} vs ${away}`;
    } else {
      return score;
    }
  };
  const results = await axios
    .request(options)
    .then((response) => {
      return response.data.response;
    })
    .catch(function (error) {
      console.error(error);
    });

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
      const winner = result.teams.home.winner ? home : away;
      const round = result.league.round;
      console.log(result.fixture.status);
      const matchStatus = matchStatusFormatter(
        result.fixture.status,
        result.score.penalty,
        winner
      );
      const penalties = result.score.penalty;
      const scores = ` ${home} ${result.goals.home} vs ${result.goals.away} ${away}`;
      const score = scoreFormatter(scores, matchStatus.long,home,away);

      const fixture = new fixtureModel({
        matchStatus: matchStatus,
        fixture: `${home} vs ${away}`,
        venue: venue,
        round: round,
        date: todayDate,
        home: home,
        away: away,
        time: time,
        score: score,
        fixtureID: fixtureID,
        competition: competition,
      });
      //Save the api response to DB
      //check if the fixture is all int he DB and update otherwise create new fixture
      const queryAndSave = async function () {
        const result = await fixtureModel
          .find({
            fixtureID: fixtureID,
          })
          .exec();

        if (result.length < 1) {
          fixture.save().then(() => console.log("now saved"));
        } else {
          fixtureModel.findOneAndUpdate(
            { fixtureID: fixtureID },
            { matchStatus: matchStatus, score: score, round: round },
            (error, data) => {
              if (error) {
                console.log(error);
              } else {
                console.log(data);
              }
            }
          );
        }
      };
      queryAndSave();
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = callFootballApi;
