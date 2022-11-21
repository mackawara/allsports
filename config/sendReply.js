
const axios=require("axios")
const sendReply= (async(req, res) => {
    let body = req.body;
  
    // Check the Incoming webhook message
    console.log(JSON.stringify(req.body, null, 2));
  
    // info on WhatsApp text message payload: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages
    if (req.body.object) {
      if (
        req.body.entry &&
        req.body.entry[0].changes &&
        req.body.entry[0].changes[0] &&
        req.body.entry[0].changes[0].value.messages &&
        req.body.entry[0].changes[0].value.messages[0]
      ) {
        console.log(req.body.object);
        let phone_number_id =
          req.body.entry[0].changes[0].value.metadata.phone_number_id;
        let from = req.body.entry[0].changes[0].value.messages[0].from; // extract the phone number from the webhook payload
        let msg_body = req.body.entry[0].changes[0].value.messages[0].text.body; // extract the message text from the webhook payload
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
                to: from,
                type: "text",
                body:msg_body
                
              },
              headers: { "Content-Type": "application/json" },
            }).then((data) => {
              console.log(data.data);
              return "Keep calm all is well";
            });
          } catch (error) {
            console.log(error.data);
            console.log(`Thre was an error on the server please try again `);
          }
      }
      res.sendStatus(200);
    } else {
      // Return a '404 Not Found' if event is not from a WhatsApp API
      res.sendStatus(404);
    }
  });
  module.exports=sendReply