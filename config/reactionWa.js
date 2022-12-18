const send = async () => {
    axios({
      method: "POST", // Required, HTTP method, a string, e.g. POST, GET
      url:
        "https://graph.facebook.com/v13.0/" +
        phoneID +
        "/messages?access_token=" +
        token,
      data: {
        messaging_product: "whatsapp",
        to: number,
        type: "reaction",
        reaction: { message_id: clientMessage},
      },
      headers: { "Content-Type": "application/json" },
    })
      .then((data) => {
        console.log("message sent successfuly");
        console.log(data.headers);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };