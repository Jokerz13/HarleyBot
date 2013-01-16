var Bot = require('../index');
var AUTH = require('../daGo');
var USERID = '50b8227daaa5cd7d09020841';
var ROOMID = '50a25f660f812c777476c5df';
var moderators = [];
var BOTS = ['50b8227daaa5cd7d09020841', '50bc2750aaa5cd5f9938fc3b', '50b92bf2eb35c119649146f9'];

var bot = new Bot(AUTH, USERID, ROOMID);
var theUsersList = {};
var isOn = true;

//When the bot enters the room it will pull the list of moderators to the mods array so mod commands are available.
bot.on('roomChanged', function (data) {
    var mods = data.room.metadata.moderator_id;
    moderators = [];
    for (var i = 0; i < mods.length; i++) {
        moderators.push(mods[i]);
    }
    theUsersList = {};
    var users = data.users;
    for (var i = 0; i < users.length; i++) {
        var user = users[i];
        theUsersList[user.userid] = user;
    }
});

//Runs the function for speak interaction
bot.on('speak', function (data) {
    // Get the data
    var name = data.name;
    var text = data.text;
    var userid = data.userid;
    var moddy = isMod(userid);
    var botty = isBot(userid);
    chatter(name, text, userid, moddy, botty);
});

//RandomAutobop function
bot.on('newsong', function (data) { voteAutomaticallyButAtRandomTime(this, data); });

//Actions taken when a new user enters the room
bot.on('registered', function (data) {
    var user = data.user[0];
    //var name = data.name;
    console.log(user.name + " = " + user.userid + " just entered the room.");
    var moddy = isMod(user.userid);
    var bot = isBot(user.userid);
    if (moddy !== true && bot !== true) {
        bot.speak('Oh hiya there @' + user.name + '! How have ya been shuga. Make yourself comfy and play whatcha wanna but dontcha anger Mr. J!');
    }
});

bot.on('deregistered', function (data) {
    var user = data.user[0];
    console.log(user.name + ' \= ' + user.userid + ' has departed');
    //delete theUsersList[user.userid];
    var moddy = isMod(user);
    if (moddy !== true) {
        bot.speak('Guess we gots ourselves another quitter. FINE @' + user.name + '!!! Dont let the door hit ya where Mr. J shived ya!!!');
    }
});

//function on newsong that adds newly played song to the top of the list and the reorders the top three songs in queue
bot.on('newsong', function (data) {
    var userid = data.room.metadata.current_dj;
    var songID = data.room.metadata.current_song._id;
    var moddy = isMod(userid);
    var botty = isBot(userid);
    modHandling(moddy, botty, songID);
});


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//All functions listed below for scripts or calls

function voteAutomaticallyButAtRandomTime(caller, data) {
    var maxWaitSeconds = 600;
    var oneSecond = 1000;
    setTimeout(function () {
        caller.vote('up');
    }, Math.floor(Math.random() * maxWaitSeconds) * oneSecond);
};

//Function to run the check that the user is a moderator
function isMod(user) {
    for (i = 0; i < moderators.length; i++) {
        if (user === moderators[i]) {
            //console.log("This is a moderator. I'm not adding this song.");
            return true;
        }
    }
};

//Function to run the check that the user is a bot
function isBot(user) {
    for (i = 0; i < BOTS.length; i++) {
        if (user === BOTS[i]) {
            console.log("This is a bot.");
            return true;
        }
    }
};

//Function of what to do if the user is not a moderator and adding a song
function modHandling(isMod, isBot, song) {
    if (isMod !== true && isBot !== true) {
        bot.playlistAdd(song);
        console.log('I just expanded my song library in my queue. Joy! Song: ' + song);
        bot.playlistAll(function (playlist) {
            bot.playlistReorder(0, 1000);
            //console.log("Here is my next song: " + playlist[0]);
        }
      );
        bot.playlistAll(function (playlist) {
            bot.playlistReorder(1, 1000);
        }
      );
        bot.playlistAll(function (playlist) {
            bot.playlistReorder(2, 1000);
        }
      );
        console.log('I\'m reordering my song library now');
    }
};

//Listing of bot responses to chatter
function chatter(name, text, userid, moddy, botty) {
    if (botty !== true) {
        switch (text) {

            //General chatter responses 
            case ':metal:':
                bot.speak("Git ya hand down before I chop it down!");
                break;

            case '/quiet':
                bot.speak("Dontcha tell me to shut up or I'll shoot ya! hehe");
                break;

            case 'hello':
                bot.speak("Hey there puddin! How are ya?");
                break;

            case 'thoughts':
                setTimeout(function () {
                    bot.speak("I'm not too sure shuga...");
                    console.log("Awaiting Bot response");
                }, 5000);
                break;

            //Responses with a bot action which is mostly DJ related at this time 
            case '/scram':
                if (moddy === true) {
                    bot.remDj();
                }
                bot.speak("All yours puddin");
                console.log("Bot is off the turntables");
                break;

            case '/junk':
                if (moddy === true) {
                    bot.playlistAll(function (playlist) {
                        bot.playlistRemove(0);
                        console.log("The current song was removed");
                    }
            );
                }
                bot.speak("We won't be hearing that any time soon... sorry Mr. J");
                bot.stopSong();
                break;

            case '/skip':
                if (moddy === true) {
                    bot.stopSong();
                }
                console.log("The current song has been skipped");
                break;

            case '/spin':
                if (moddy === true) {
                    bot.addDj();
                }
                bot.speak("On it shuga");
                console.log("Bot has been added to DJ");
                break;

            case 'remix':
                bot.playlistAll(function (playlist) {
                    bot.playlistReorder(0, 1000);
                }
            );
                bot.playlistAll(function (playlist) {
                    bot.playlistReorder(1, 1000);
                }
            );
                bot.playlistAll(function (playlist) {
                    bot.playlistReorder(2, 1000);
                }
            );
                console.log("Requested playlist rearrangement completed");
                bot.speak("The deck's been reshuffled shuga ;-)");
                break;

            case 'rock it':
                bot.vote('up');
                break;
        }
    }
};