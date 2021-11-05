const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const request = require("request");
const port = 3000;
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

//get request for the signup homepage
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html")
});

//post request for the signup form
app.post("/", (req, res) => {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

//sotring the required member info for mailchimp
  var data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

//converting the data variable from JavaScript to JSON
  var jsonData = JSON.stringify(data);
  
/*All following API keys have been removed for account secuirty purposes*/
//url for all post requests
  const url = "https://us20.api.mailchimp.com/3.0/lists/{ListIDGoesHere}"

  const options = {
    method: "POST",
    auth: "christianbonte:{API key goes here}"
  }

//request to send members to mailcchimp
  const request = https.request(url, options, (response) => {

    if (response.statusCode === 200) {
      res.send("Successfully subscribed!");
    }
    else {
      res.send("There was an error signing you up!");
    }

    response.on("data", (data) => {
      console.log(JSON.parse(data));
    });
  });

request.write(jsonData);
request.end();

});

//running server on port 3000
app.listen(port, () => {
  console.log("Running on port " + port);
});
