//requires the dotenv config contatining all the API keys
require("dotenv").config();
var fs = require("fs");
var Twitter = require('twitter');
var keys = require("./keys.js");
//holds the command determining which function to call
var program = process.argv[1];
//holds the command determining what argument to pass said function
var command = process.argv[2];
//array for the "do-what-it-says" function 
var custom = [];


var client = new Twitter(keys.twitter);
var params = {screen_name: 'liri_project_tw'};




var TweetThis = function(command){
    this.content = command;
    this.getTweets = function() {
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

    this.postTweet = function() {
        client.post('statuses/update', {status: command},  function(error, tweet, response) {
            if(error) throw error;
            console.log(tweet);  // Tweet body. 
            console.log(response);  // Raw response object. 
        });
    };

    }





var tweeter = new TweetThis(command);

tweeter.getTweets();
