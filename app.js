const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const moment = require("moment");
const cron = require("node-cron");

require("dotenv").config();

//Database connection
const mongoose = require("mongoose");
const connectDB = require("./config/database");
const { stringify } = require("querystring");
connectDB().then(async () => {
  app.use(bodyParser.json());
  app.use(express.static(`${__dirname}/public`));
  /* All sports  */

  const searchDb = require("./controllers/searchDB");

  const allSportsPageID = process.env.ALLSPORTS_PAGE_ID;
  const pageID = process.env.ALLSPORTS_ID;

  var date = moment();
  var currentDate = date.format("YYYY-MM-D");

  //routes(app);
  const PORT = process.env.PORT || 3001;
  /* Exernal Functions */
  const sendWhatsapp = require("./config/sendWhatsapp");
  const callFootballApi = require("./config/callFootballApi");
  const getFixtures = require("./controllers/getFixtures");

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
      timezone: "Africa/Harare",
    },
    headers: {
      "X-RapidAPI-Key": rapidApiKey,
      "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
    },
    /* params: { live: "all", league: "39" }, */
  };

  const optionsGetLeague = {
    method: "GET",
    url: "https://api-football-v1.p.rapidapi.com/v3/leagues",
    params: { country: "world", season: "2022" },
    headers: {
      "X-RapidAPI-Key": rapidApiKey,
      "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
    },
  };
  app.get("/getleagues", async (req, res) => {
    const leagues = await axios
      .request(optionsGetLeague)
      .then((response) => {
        data = response.data;

        return data.response;
      })
      .catch(function (error) {
        console.error(error);
      });

    res.send(leagues);
  });

  /* Cron jobs */

  const fixtureModel = require("./models/fixture");

  var todayDate = new Date().toISOString().slice(0, 10);

  cron.schedule(
    " */6 * * * *",
    async () => {
      await callFootballApi();
      const optedInClients = await clientNumberModel
        .find({ optedIn: true })
        .exec();
      console.log(optedInClients[0].number);

      const result = await fixtureModel
        .find({
          date: todayDate,
        })
        .exec()
        .catch((error) => console.log(error));

      result.forEach((fixture) => {
        if (fixture.matchStatus.includes("Not Started")) {
          optedInClients.forEach((client) => {
            const number = client.number;
            sendWhatsapp(number, fixture);
          });
        } else {
          console.log("no match in progress");
        }
      });
      console.log("cron running");
    },
    { scheduled: true, timezone: "UTC" }
  );
  /* Routes */
  const clientNumberModel = require("./models/clientNumber");
  const myNumber = new clientNumberModel({
    number: "263775231426",
    date: "04/12/22",
  });
  const MessageIdModel = require("./models/webhook");

  app.post("/watsapp", async (req, res) => {
    console.log("top hit");
    //console.log(JSON.stringify(req.body, null, 2));
    if (req.body.object) {
      //check if the pyload has all the fields required
      if (
        req.body.entry &&
        req.body.entry[0].changes &&
        req.body.entry[0].changes[0] &&
        req.body.entry[0].changes[0].value.messages &&
        req.body.entry[0].changes[0].value.messages[0]
      ) {
        const messageId = req.body.entry[0].changes[0].value.messages[0].id;

        if ((await searchDb("messageId", messageId, MessageIdModel)) == false) {
          console.log("MESAGE NOT Handled yet");

          await MessageIdModel.create({
            date: todayDate,
            messageId: messageId,
          }).catch((err) => console.log(err));
          console.log("processing message");

          let msg_body =
            req.body.entry[0].changes[0].value.messages[0].text.body;
          let from = req.body.entry[0].changes[0].value.messages[0].from;
          let phone_number_id =
            req.body.entry[0].changes[0].value.metadata.phone_number_id;
          const stop = new RegExp("stop", "i");
          const start = new RegExp("start", "i");
          if (!(await searchDb("number", from, clientNumberModel))) {
            //check if the number is existing and if not save it .
            console.log("number not found");
            const newNumber = new clientNumberModel({
              number: from,
              optedIn: true,
              date: todayDate,
              phone_number_id: phone_number_id,
              preference: "football",
            });
            newNumber.save();
          } else {
            // if the number is present check if any of the opt in or opt out key words
            if (start.test(msg_body)) {
              console.log("message with start");
              let number = await clientNumberModel
                .find({ number: from })
                .exec();
              console.log(number[0]);
              number[0].optedIn = true;

              await number[0].save().then((data) => console.log(data));
            } else if (stop.test(msg_body)) {
              let number = await clientNumberModel.findOne({ number: from });
              number.optedIn = false;
              await number.save().then((data) => console.log(data));
            } else {
            }
          }

          //}
          res.sendStatus(200).end();
        } else {
          res.sendStatus(404);
        }
      }
    } else return;
  });
  /* Verfiy Whatsapp to receive messages */
  app.get("/watsapp", (req, res) => {
    console.log("whatsapp get hit");
    console.log(req.body);
    /* UPDATE YOUR VERIFY TOKEN
    This will be the Verify Token value when you set up webhook TO RECIEVE MESSAGEES ON THE NUMBER
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

    fixtures.forEach((fixture) => {
      console.log(fixture);
      const time = new Date(
        fixture.fixture.timestamp * 1000
      ).toLocaleTimeString();
      const fixtureID = fixture.fixture.id;
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
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}!`);
  });
}); // runs the code that connects to the databse
//const routes = require('./routes');
