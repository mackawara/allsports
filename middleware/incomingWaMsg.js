const searchDb = require("../controllers/searchDB");
const sendWhatsappRep = require("../config/sendWhatsappRep");
const getFixtures=require("../controllers/getFixtures")
//Whatsapp tokens
const token = process.env.ALL_SPORT_PAGE_ACCESS_TOKEN;
const phoneID = process.env.WHATSAPP_PHONE_ID;

//Models
const MessageIdModel = require("../models/webhook");
const ClientNumberModel = require("../models/clientNumber");
const FixtureModel = require("../models/fixture");

// Regex
const stop = new RegExp("stop", "i");
const start = new RegExp("start", "i");
const englishPremier = new RegExp("epl", "i");
// Utility variabbles
var todayDate = new Date().toISOString().slice(0, 10);
const incomingWaMsg = async (req, res) => {
  //console.log(JSON.stringify(req.body, null, 2));
  if (req.body.object) {
    console.log("testing");
    //check if the pyload has all the fields required
    if (
      req.body.entry &&
      req.body.entry[0].changes &&
      req.body.entry[0].changes[0] &&
      req.body.entry[0].changes[0].value.messages &&
      req.body.entry[0].changes[0].value.messages[0]
    ) {
      let msg_body = req.body.entry[0].changes[0].value.messages[0].text.body;
      let from = req.body.entry[0].changes[0].value.messages[0].from;
      let phone_number_id =
        req.body.entry[0].changes[0].value.metadata.phone_number_id;
      const messageId = req.body.entry[0].changes[0].value.messages[0].id;
      // Achieve Idempotency  by checking if the message has already been handled
      if (!(await searchDb("messageId", messageId, MessageIdModel))) {
        await MessageIdModel.create({
          date: todayDate,
          messageId: messageId,
          time: new Date().toLocaleTimeString(),
        }).catch((err) => console.log(err));
        console.log("processing message");

        if (!(await searchDb("number", from, ClientNumberModel))) {
          //check if the number is existing and if not save it .
          console.log("number not found");
          const newNumber = new ClientNumberModel({
            number: from,
            optedIn: true,
            date: todayDate,
            phone_number_id: phone_number_id,
            preference: "football",
          });
          newNumber.save();
        }
        // if the number is present check if any of the opt in or opt out key words
        if (start.test(msg_body)) {
          console.log("message with start");
          let number = await ClientNumberModel.findOne({
            number: from,
          }).exec();

          number.optedIn = true;

          await number.save().then((data) => console.log(data));
          sendWhatsappRep(from, msg_body);
        } else if (stop.test(msg_body)) {
          let number = await ClientNumberModel.findOne({
            number: from,
          });
          number.optedIn = false;
          await number.save().then((data) => console.log(data));
        } else if (msg_body.includes("league")) {
            console.log("league")
            const lastLetter=msg_body.length
            const league=msg_body.slice(8,lastLetter)
          console.log(league)
          const formatted= await getFixtures(league)
          sendWhatsappRep(from,formatted)}
        } else {
        }
      }

      //}
      res.sendStatus(200).end();
    } else {
      res.sendStatus(404);
    }
  } 
module.exports = incomingWaMsg;
