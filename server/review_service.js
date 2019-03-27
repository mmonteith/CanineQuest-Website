/*
    Final Project 
    Michelle Monteith
    CSC 337 Fall 2018
    
    Server side code for Canine Quest website. Has two HTTP requests:
        GET - returns all game reviews as JSON
        POST - adds a new review to the text file.
*/

const express = require("express");
const fs = require("fs");
const bodyParser = require('body-parser');
const swearjar = require('swearjar');

const app = express();
const jsonParser = bodyParser.json();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", 
               "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/**
    Reads the reviews text file and sends them to the client as JSON
*/
app.get('/', function (req, res) {
    let file = fs.readFileSync("../data/reviews.txt", 'utf8');
    let lines = file.split("\n");

    let reviews = {};
    reviews["reviews"] = [];

    // Iterate over each line and split the line by the name/rate/review.
    for(let i = 0; i < lines.length-1; i++){
        let line = lines[i].trim().split(":");
        let entry = {};

        entry["name"] = line[0];
        entry["rate"] = line[1];
        entry["review"] = String(line[2]).trim();
        reviews["reviews"].push(entry);
    }
    res.send(JSON.stringify(reviews));
})

/**
    Appends a new message to messages.txt, returns a 200 on sucess, 400 on failure.
*/
app.post('/', jsonParser, function (req, res) {
    const name = req.body.name;
    const rate = req.body.rate;
    const review = req.body.review;

    // Final validation, if there's profanity return an error and don't store the review.
    if(swearjar.profane(review)){
        console.log("ERROR 406: Review contains profanity.");
        res.send("Profanity Check Failure");
        return;
    }

    fs.appendFile("../data/reviews.txt", name + ":" + rate + ":" + review + "\r\n", function(err) {
        if(err) {
            console.log("ERROR 400: " + err);
            res.status(400);
            return;
        }
        console.log("SUCCESS 200: Review written.");
        res.status(200);
        res.send("Success");
    });
});

app.listen(3000);