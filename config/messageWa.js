const axios=require("axios")
const token = process.env.ALL_SPORT_PAGE_ACCESS_TOKEN;
const phoneID=process.env.WHATSAPP_PHONE_ID
const messageWa=(number,message)=>{
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
          text: { body: "Ack: " + message },
        },
        headers: { "Content-Type": "application/json" },
      });
}
module.exports=messageWa
