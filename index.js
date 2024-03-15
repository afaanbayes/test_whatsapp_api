const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config()
const app = express().use(bodyParser.json());

const WEBHOOK_VERIFY_TOKEN= process.env.WEBHOOK_VERIFY_TOKEN;
const GRAPH_API_TOKEN= process.env.GRAPH_API_TOKEN;

app.listen(8000 || process.env.PORT,()=>{
    console.log('webhook is listening') 
});


app.get("/webhook", (req, res) => {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];
  
    // check the mode and token sent are correct
    if (mode === "subscribe" && token === WEBHOOK_VERIFY_TOKEN) {
      // respond with 200 OK and challenge token from the request
      res.status(200).send(challenge);
      console.log("Webhook verified successfully!");
    } else {
      // respond with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  });

app.post("/webhook", async (req, res) => {

    let body_param = req.body;
    console.log(JSON.stringify(body_param,null,2));


    if (body_param.object){

        if(body_param.entry &&
            body_param.entry[0].changes &&
            body_param.entry[0].changes.value.message &&
            body_param.entry[0].changes.message[0] )
         {
            let phone_no_id = body_param.entry[0].changes.value.metadata.phone_number_id;
            let from = body_param.entry[0].changes.value.messages.from;
            let msg_body = body_param.entry[0].changes.value.messages[0].text.body;

            axios({
                method: "POST",
                url: "https://graph.facebook.com/v18.0/"+phone_no_id+"/messages?access_token="+WEBHOOK_VERIFY_TOKEN,
                data: {
                  messaging_product: "whatsapp",
                  to:from,
                  text:{
                    body:"Hi Afaan"
                  },
                },
                headers: {
                    "Content-Type": "application/json",
                },
              });
              res.sendStatus(200);
             }
             else
             {
                res.sendStatus(404);
             }
            }
            
            });
  
  