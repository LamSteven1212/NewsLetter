// jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

// Provide the path of our static folder, to be able to refer to these static files
// by a relative url
app.use(express.static("public"));
// indicating that our website is going to use BodyParser
app.use(bodyParser.urlencoded({extended: true}));

// Indicates what to send at the home route
app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
});

// Creating the post request for the homeroute
app.post("/", function(req, res) {
  // refers to variables in signup.html by using their names
  // we set them as constants because we are not going to change users infor
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;
  // To print on your terminal
  console.log(firstName, lastName, email);

  var data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        // merge field is a varaible, but it is an object
        merge_fields: {
        // FNAME and LNAME comes from default values set by mailchimp
          FNAME: firstName,
          LNAME: lastName
      }
    }
  ]
  };

  // transform data into a String and in a JSON format
  const jsonData = JSON.stringify(data);

  // number after "us" is number at the end of your API key
  // after ".com/", put your audience key
  const url = "https://us8.api.mailchimp.com/3.0/lists/e963af29c1";

  // It's a Javascript object!!
  const options = {
    method: "POST",
    // this serves as an authentication
    // the region of your api key must match the region of your URL (BOTH US8)
    auth: "steven1:e46e41b1ff677924a96c2f549c775d16-us8"

  }

  // to know which url to use go on mailchim website, to see which they are using, and get a response from mailchimp server
  // we have to store all the data from a user into a variable to be able to send it later to mailchimp
  const request = https.request(url, options, function(response) {
    // getting the status code from the object response when user makes a request
    if (response.statusCode === 200) {
      // if good redirect to success.html
      res.sendFile(__dirname + "/success.html");
    } else {
      // if not redirect to failure.html
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", function(data) {
      console.log(JSON.parse(data));
    })
  })
  // where we actually send some data to mailchimp
  request.write(jsonData);
  request.end();
});

// creating a post route for failure
app.post("/failure", function(req, res) {
  // redirects the user to the post route, after cliking on try again button of failure.html
  res.redirect("/");
})

app.listen(3000, function() {
  console.log("Server is running on port 3000");
});

// My API key : e46e41b1ff677924a96c2f549c775d16-us8

// My Audience ID : e963af29c1 (not sure if the good one)
// list id allows mailchimp to know to which list you need to subscribe your users

// 180eb3f31b4ccbbf8441c5ee09c34070-us8
//e963af29c1