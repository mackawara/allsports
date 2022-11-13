const axios=require("axios")
const phoneID=process.env.WHATSAPP_PHONE_ID
const token=process.env.ALL_SPORT_PAGE_ACCESS_TOKEN
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
          text: { body: message },
        },
        headers: { "Content-Type": "application/json" },
      }).then((data) => {
        console.log(data.data);
        return "Booking was saved , confirmation was also sent to your email";
      });
    } catch (error) {
        console.log(error)
      console.log(`Thre was an error on the server please try again `);
    }
  };
  
module.exports = sendWhatsapp;