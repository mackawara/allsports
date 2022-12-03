const axios = require("axios");
const phoneID = process.env.WHATSAPP_PHONE_ID;
const token = process.env.ALL_SPORT_PAGE_ACCESS_TOKEN;
const sendWhatsapp = async (number, fixtures) => {
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
                  text: fixtures.header,
                },
              ],
            },
            {
              type: "body",
              parameters: [
                {
                  type: "text",
                  text: fixtures.forEach(fixture => {
                    return (
                        `Competition: *${fixture.competition}*
                        Score:${ fixtures.matchStatus.long == "Not Started"
                        ? "Match yet to Begin"
                        : fixture.matchStatus.long == "Match Finished"
                        ? `Match Finished + *${fixture.score}*`
                        : `In progress: *${fixture.score}**,  ${fixture.matchStatus.elapsed} minutes played`}
                        Match status: ${fixture.matchStatus}
                        `
                    )
                    
                  })
                },
                
                {
                  type: "text",
                  text:
                    fixtures.matchStatus.long == "Not Started"
                      ? "Match yet to Begin"
                      : fixtures.matchStatus.long == "Match Finished"
                      ? `Match Finished + *${fixtures.score}*`
                      : `In progress: *${fixtures.score}**,  ${fixtures.matchStatus.elapsed} minutes played`,
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
    console.log(error.data);
    console.log(`Thre was an error on the server please try again `);
  }
};

module.exports = sendWhatsapp;
