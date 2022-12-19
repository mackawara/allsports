var axios = require("axios");

const rapidApiKey = process.env.X_RAPID_API_KEY;
console.log(rapidApiKey);
const options = {
  method: "GET",
  url: `https://api-football-v1.p.rapidapi.com/v3/leagues`,
  params: {
    // season: "2022",
    country: "Italy",
    //  timezone: "Africa/Harare",
  },
  headers: {
    "X-RapidAPI-Key": rapidApiKey,
    "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
  },
};
const getLeague = () => {
  axios
    .request(options)
    .then(function (response) {
      console.log(response.data.response);
    })
    .catch(function (error) {
      console.error(error);
    });
};
module.exports = getLeague;
