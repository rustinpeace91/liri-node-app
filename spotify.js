//requires the dotenv config contatining all the API keys
require("dotenv").config();
var fs = require("fs");
var Spotify = require('node-spotify-api');
var keys = require("./keys.js");
//holds the command determining which function to call


//Spotify and Twitter objects
var spotify = new Spotify(keys.spotify);



//function for calling the spotify API and passing it a song name
//passes the API JSON data into a variable and logs it and appends it to log.txt
var spotGet = function (command, spotify) {
    this.song = command;
    this.album = '';
    this.songName = '';
    this.artist = '';
    this.URL = '';
    this.logTXT = '';
    this.getData = function () {
        spotify.search({ type: 'track', query: "Beat It", function(err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            };
            console.log(data);
            this.album = data.tracks.items[0].album['name'];

            this.songName = data.tracks.items[0]["name"];

            this.artist = data.tracks.items[0].album.artists[0].name;
            
            this.URL = data.tracks.items[0].external_urls["spotify"];
            console.log(artist);
        }});
    };

    this.writeData = function () {
        this.logTxt = "Song name: " +
        this.album +
        "\nAlbum name: " +
        this.songName +
        "\nArtist name: " +
        this.artist +
        "\nSong URL: " +
        this.URL;

    };


    /*this.logTxt = "Song name: " +
        this.data.tracks.items[0]["name"] +
        "\nAlbum name: " +
        this.data.tracks.items[0].album["name"] +
        "\nArtist name: " +
        this.data.tracks.items[0].album.artists[0].name +
        "\nSong URL: " +
        this.data.tracks.items[0].external_urls["spotify"];*/

    //fs.writeFile("log.txt", logtxt);

    this.logIt = function () {
        //console.log(this.song);
        //console.log(this.logTxt)
        appendFile('log.txt', this.logTxt, (err) => {

            if (err) throw err;
            console.log('The File has been saved!');
        });
    };


};

module.exports = spotGet;
