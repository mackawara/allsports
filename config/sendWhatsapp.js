const axios = require("axios");
const phoneID = process.env.WHATSAPP_PHONE_ID;
const token = process.env.ALL_SPORT_PAGE_ACCESS_TOKEN;
const fixtureModel = require("../models/fixture");
var todayDate = new Date().toISOString().slice(0, 10);
console.log(todayDate);

const sendWhatsapp = async (number, message) => {
  try {
    axios({
      method: "POST", // Required, HTTP method, a string, e.g. POST, GET
      url:
        "https://graph.facebook.com/v15.0/" +
        phoneID +
        "/messages?access_token=" +
        token,
      data: {
        messaging_product: "whatsapp",
        to: number,
        type: "template",
        template: {
          name: "score_update",
          language: {
            code: "en_US",
          },
          components: [
            {
              type: "header",
              parameters: [
                {
                  type: "text",
                  text: message.competition,
                },
              ],
            },
            {
              type: "body",
              parameters: [
                {
                  type: "text",
                  text: message.score,
                },
                {
                  type: "text",
                  text: message.date,
                },
                {
                  type: "text",
                  text: message.time,
                },
                {
                  type: "text",
                  text: message.venue,
                },
                {
                  type: "text",
                  text: message.matchStatus,
                },
              ],
            },
          ],
        },
      },
    }).then((data) => {
      console.log(data.data);
      return "Booking was saved , confirmation was also sent to your email";
    });
  } catch (error) {
    console.log(error.data.data);
    console.log(`Thre was an error on the server please try again `);
  }
};

module.exports = sendWhatsapp;
