//requires the dotenv config contatining all the API keys
require("dotenv").config();
var fs = require("fs");
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var keys = require("./keys.js");
//holds the command determining which function to call
var program = process.argv[2];
//holds the command determining what argument to pass said function
var command = process.argv[3];
//array for the "do-what-it-says" function 
var custom = [];

//Spotify and Twitter objects
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
var params = {screen_name: 'liri_project_tw'};


//function for calling the spotify API and passing it a song name
//passes the API JSON data into a variable and logs it and appends it to log.txt
function spotThis(command) {
    spotify.search({ type: 'track', query: command }, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
    var logTxt = "Song name: " +
        data.tracks.items[0]["name"] +
        "\nAlbum name: " +
        data.tracks.items[0].album["name"] +
        "\nArtist name: " + 
        data.tracks.items[0].album.artists[0].name +
        "\nSong URL: " + 
        data.tracks.items[0].external_urls["spotify"];
        console.log(logTxt);
    //fs.writeFile("log.txt", logtxt);
    fs.appendFile('log.txt', logTxt, (err) => {
        if(err) throw err;
        console.log('The File has been saved!');
    });
    
  })
};

//gathers tweets and logs them to the command line. 
//cycles through the tweets as an array and appends them to a variable which is logged and appended to a text file
function myTweets(){
  client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {
        var twitTxt = "";
        for(i in tweets){
            if(i <= 20){
                console.log(tweets[i].text);
                twitTxt += tweets[i].text + "\n";
                console.log(tweets[i].created_at);
                twitTxt += tweets[i].created_at + "\n";
                
            } else {
                break;
            }
        }
        fs.appendFile('log.txt', twitTxt, (err) => {
            if(err) throw err;
            console.log('The File has been saved!');
        });
    }
    if(error){
        throw error;
    }
  })
};

//also decided to make use of the client.post method so I can post tweets from the command line without having to look at twitter
function tweetThis(command){
    client.post('statuses/update', {status: command},  function(error, tweet, response) {
        if(error) throw error;
        console.log(tweet);  // Tweet body. 
        console.log(response);  // Raw response object. 
      });
}



function omdbThis(command) {
    var request = require('request');
    request('http://www.omdbapi.com/?apikey=trilogy&t=' + command, function (error, response, body) {
        var parsed = JSON.parse(body);
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


//main function.  Takes in command line arguments and decides how to process them
function main() {
    //if do-what-it-says is typed, sets the command line argument variables to the data in the text file
    if(program === "do-what-it-says"){
        fs.readFile("random.txt",'utf8', (err,data) => {
            if (err) throw err;
            custom = data.split(",");
            program = custom[0];
            command = custom[1];
            console.log(program);
            main();
        });
    };
    
    if(program === "my-tweets"){
        myTweets();
    };

    if(program === "spotify-this-song"){
        spotThis(command);
    };

    if(program === "movie"){
        if(process.argv[3] === undefined){
            command = "Mr. Nobody";
        };
        omdbThis(command);
    };

    if(program === "tweet-this"){
        tweetThis(command);
    }; 
};

//main function call
main();