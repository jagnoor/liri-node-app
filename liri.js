// Liri takes the following arguments
// * my-tweets
// * spotify-this-song
// * movie-this
// * do-what-it-says

// Commands to run LIRI
// -node liri.js my-tweets
// -node liri.js spotify-this-song '<song name here>'
// -node liri.js movie-this '<movie name here>'
// -node liri.js do-what-it-says

require('dotenv').config()

// const result = dotenv.config()

// if (result.error) {
//   throw result.error
// }

// console.log(result.parsed)

// these add other programs to this one
let dataKeys = require('./keyFile.js')
let fs = require('fs') // file system
let twitter = require('twitter')
let Spotify = require('node-spotify-api')
let request = require('request')
let space = '\n' + '\n' + '\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0'

// FIXME: There is a throw err i need to fix.. 

// var writeToLog = function (data) {
//     fs.appendFile("log.txt", '\r\n\r\n')

//     fs.appendFile("log.txt", JSON.stringify(data), function (err) {
//         if (err) {
//              console.log(err)
//         } 
       
//              console.log('log.txt was updated with very usefull information! only for you')
//     })
// }

// =================================================================
// Spotify function, Spotify api
function getMeSpotify(songName) {
    let spotify = new Spotify(dataKeys.spotifyKeys)

    if (!songName) {
        songName = 'The Sign'
    }

    spotify.search({
        type: 'track',
        query: songName
    }, function (err, data) {
        if (err) {
            console.log('Error occurred: ' + err)
            return
        } else {
            output = space + '================= LIRI FOUND THIS FOR AWESOME INFORMATION YOU YOU ...==================' +
                space + 'Song Name: ' + "'" + songName.toUpperCase() + "'" +
                space + 'Album Name: ' + data.tracks.items[0].album.name +
                space + 'Artist Name: ' + data.tracks.items[0].album.artists[0].name +
                space + 'URL: ' + data.tracks.items[0].album.external_urls.spotify + '\n\n\n'
            console.log(output)

            fs.appendFile('log.txt', output, function (err) {
                if (err) throw err
                console.log('This information is Saved! in log.txt ')
            })
        };
    })
}

// created a new Twitter account for this assignment - https://twitter.com/AccountJag
// - Twitter: https://apps.twitter.com/app/new

let getTweets = function () {
    let client = new twitter(dataKeys.twitterKeys)
    let params = {
        screen_name: 'AccountJag',
        count: 3
    }

    client.get('statuses/user_timeline', params, function (err, tweets, res) {
        if (!err) {
            // let data = space + 'created at: ' + tweets.created_at +
            //     space + 'Tweets: ' + tweets.text;
            let data = [] // empty array to hold data
            for (let i = 0; i < tweets.length; i++) {
                data.push({
                    'created at: ': tweets[i].created_at,
                    'Tweets: ': tweets[i].text
                })
            }
            console.log(data)

            //FIXME:   
            // writeToLog(data)

            //fs.appendFile('log.txt', '\r\n\r\n')
            fs.appendFile('log.txt',JSON.stringify(data), function (err) {
                if (err) throw err
                console.log('\r\n\r\n This information is Saved! in log.txt \r\n\r\n')
            })

        }
    })


}



// OMDb API: http://www.omdbapi.com/apikey.aspx

let getMeMovie = function (movieName) {
    if (!movieName) {
        movieName = 'Mr Nobody'
    }
    // Get your OMDb API key creds here http://www.omdbapi.com/apikey.aspx
    // t = movietitle, y = year, plot is short, then the API key
    let urlHit = 'http://www.omdbapi.com/?t=' + movieName + '&y=&plot=short&apikey=fac9245f'

    request(urlHit, function (err, res, body) {
        if (err) {
            console.log('Error occurred: ' + err)

        } else {
            let jsonData = JSON.parse(body)
            // console.log(jsonData);
            output = space + '===###= LIRI FOUND THIS SUPER USEFULL INFO ONLY FOR YOU...===###==========' +
                space + 'Title: ' + jsonData.Title +
                space + 'Year: ' + jsonData.Year +
                space + 'Rated: ' + jsonData.Rated +
                space + 'IMDB Rating: ' + jsonData.imdbRating +
                space + 'Country: ' + jsonData.Country +
                space + 'Language: ' + jsonData.Language +
                space + 'Plot: ' + jsonData.Plot +
                space + 'Actors: ' + jsonData.Actors +
                space + 'IMDb Rating: ' + jsonData.imdbRating + '\n\n\n';

            console.log(output)

            fs.appendFile('log.txt', output, function (err) {
                if (err) throw err
                console.log('Saved!')
            })
        }
    })
}

let doWhatItSays = function () {
    fs.readFile('random.txt', 'utf8', function (error, data) {
        console.log(data)
        // writeToLog(data)
        let dataArr = data.split(',')

        if (dataArr.length == 2) {
            pick(dataArr[0], dataArr[1])
        } else if (dataArr.length == 1) {
            pick(dataArr[0])
        }
    })
}

let pick = function (caseData, functionData) {
    switch (caseData) {
        case 'my-tweets':
            getTweets()
            break
        case 'spotify-this-song':
            getMeSpotify(functionData)
            break
        case 'movie-this':
            getMeMovie(functionData)
            break
        case 'do-what-it-says':
            doWhatItSays()
            break
        default:
            console.log('LIRI doesn\'t know that- ARE YOU KIDDING ME !!!!')
    }
}

let runThis = function (argOne, argTwo) {
    pick(argOne, argTwo)
}

runThis(process.argv[2], process.argv[3])

// # Liri - a node application

// To install these npm packages run these commands one at a time.

// ```
// npm install twitter
// npm install node-spotify-api
// npm install request
// ```

// ### Commands to run LIRI
// Follow the format presented in these queries
// ```
// -node liri.js my-tweets
// -node liri.js spotify-this-song '<song name here>'
// -node liri.js movie-this '<movie name here>'
// -node liri.js do-what-it-says
// ```

// ### API Credential sites

// Twitter: https://apps.twitter.com/app/new

// Spotify: https://developer.spotify.com/my-applications/

// OMDb API: http://www.omdbapi.com/apikey.aspx