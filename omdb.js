//requires the dotenv config contatining all the API keys
require("dotenv").config();
var fs = require("fs");
var keys = require("./keys.js");
var request = require('request');
//holds the command determining which function to call


//Spotify and Twitter objects
var params = {screen_name: 'liri_project_tw'};




var omdbThis = function(command) {
    this.command = command;
    //this.getType = function(){console.log(typeof(this.command))};
    this.getMovie = function(){
        request('http://www.omdbapi.com/?apikey=trilogy&t=' + this.command, function (error, response, body) {
            var parsed = JSON.parse(body);
            //console.log(parsed);
            var movieTxt = "Title: " + parsed.Title +
            "\nYear Released: " + parsed.Year +
            "\nIMDB Rating: " + parsed.imdbRating +
            "\nRotten Tomatoes Rating: " + parsed.Ratings[1].Value +
            "\nCountry: " + parsed.Country +
            "\nLanguage" + parsed.Language +
            "\nPlot: " + parsed.Plot +
            "\nCast: " + parsed.Actors;
            //console.log(parsed)
            console.log(movieTxt)
            //fs.writeFile("log.txt", movieTxt);
            fs.appendFile('log.txt', movieTxt, (err) => {
                if(err) throw err;
                console.log('The File has been saved!');
            });
        });
    };
};

module.exports = omdbThis;

//main function.  Takes in command line arguments and decides how to process them

//main function call
