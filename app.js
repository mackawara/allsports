const express = require("express");
const bodyParser = require("body-parser");
const app = express();
//const routes = require('./routes');
require("dotenv").config();

app.use(bodyParser.json());
app.use(express.static(`${__dirname}/public`));
const connectDB=require("./config/database")
//routes(app);
const PORT = process.env.PORT || 3000;
connectDB().then(()=>{
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}!`);
  });
})

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
  headers: {
    "X-RapidAPI-Key": rapidApiKey,
    "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
  },
  params: { live: "all", league: "39" },
};

const allSportsPageID = process.env.ALLSPORTS_PAGE_ID;
const pageID = process.env.ALLSPORTS_ID;
console.log(allSportsPageID, pageID);
//"https://graph.facebook.com/{your-user-id}/accounts?access_token={user-access-token}
const options2 = {
  method: "get",
  url:
    "https://graph.facebook.com/" +
    5632068726880896 +
    "/accounts?access_token=EAAJwHbsiZA7sBAOs1qrpPmDZB0GdyeMyXJEVVYVe4ZCpQYdCINq30NzmGSIqBt7OZAkg09CqplOWKnXwxxI9abBR8iXI7jOMjN3gM6J6LMPmZCUTowUN0vgpvIjWLnWc6Wyv9EqSEzlzm3BAZCt4bZBohVNebljKpKH9vEb6IFFSxErSbUGpvJXMwbXyaIByZCuIH7dZCYTHSVZCKlZBPeqvzvP2FBO3mTaOzuOr2JnHsfdaq0ZAvOgJFGxcWfQkQEdXhwEZD",
};

//today=`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
let pageToken,tasks
axios
  .request(options2)
  .then(function (response) {
    pageToken = JSON.stringify(response.data.data[0].access_token);
    tasks = JSON.stringify(response.data.data[0].tasks);
    console.log(pageToken);
    console.log(tasks)
  })
  .catch(function (error) {
    console.error(error);
  });

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
app.get("/", (req, res) => {
  res.send(scores);
});
