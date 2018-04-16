require("dotenv").config();
var fs = require("fs");
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var keys = require("./keys.js");
var program = process.argv[2];
var command = process.argv[3];


var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
var params = {screen_name: 'liri_project_tw'};

   
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

 
 function tweetThis(){
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
        //fs.writeFile('pretty.json', JSON.stringify(tweets, null, 4));
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

function twitterBot(command){
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



if(program === "my-tweets"){
    tweetThis();
}
if(program === "spotify-this-song"){
    spotThis(command);
}

if(program === "movie"){
    if(process.argv[3] === undefined){
        command = "Mr. Nobody";
    }
    omdbThis(command);
}

if(program === "twitter-bot"){
    twitterBot(command);
}