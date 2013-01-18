var Bot = require('../index');
var AUTH = require('../daGo');
var fs = require('fs')
var USERID = '50b8227daaa5cd7d09020841';
var ROOMID = '50a25f660f812c777476c5df';
var moderators = [];
var BOTS = ['50b8227daaa5cd7d09020841', '50bc2750aaa5cd5f9938fc3b', '50b92bf2eb35c119649146f9'];
var bot = new Bot(AUTH, USERID, ROOMID);
var theUsersList = {};
var isOn = true;
var sayQuotes = true;
var time = randomNum();

//When the bot enters the room it will pull the list of moderators to the mods array so mod commands are available.
bot.on('roomChanged', function (data)
{
    var mods = data.room.metadata.moderator_id;
    moderators = [];
    for (var i = 0; i < mods.length; i++)
    {
        moderators.push(mods[i]);
    }
    theUsersList = {};
    var users = data.users;
    for (var i = 0; i < users.length; i++)
    {
        var user = users[i];
        theUsersList[user.userid] = user;
    }
    //Quote fetching based on a timer
    setInterval(timeToQuote, time);
});

//Runs the function for public speak interaction
bot.on('speak', function (data)
{
    // Get the data
    var name = data.name;
    var text = data.text;
    var userid = data.userid;
    var moddy = isMod(userid);
    var botty = isBot(userid);
    var src = 'public';
    chatter(name, text, userid, moddy, botty, src);
});

//Runs the speak commands when received via a private message
bot.on('pmmed', function (data)
{
    var sender = data.senderid;
    var pmtext = data.text;
    var receiver = data.userid;
    var moddy = isMod(sender);
    var botty = isBot(sender);
    var src = 'pm';
    chatter(null, pmtext, sender, moddy, botty, src);
});

//Actions taken when a new user enters the room
bot.on('registered', function (data)
{
    var user = data.user[0];
    var name = user.name;
    var msg = '_register';
    var ID = user.userid;
    var moddy = isMod(user.userid);
    var botty = isBot(user.userid);
    theUsersList[user.userid] = user;
    chatter(name, msg, ID, moddy, botty, null);
});

bot.on('deregistered', function (data)
{
    var user = data.user[0];
    var name = user.name;
    var msg = '_adios';
    var ID = user.userid;
    var moddy = isMod(user);
    var botty = isBot(user);
    delete theUsersList[user.userid];
    chatter(name, msg, ID, moddy, botty, null);
});

//function on newsong that adds newly played song to the top of the list and the reorders the top three songs in queue
bot.on('newsong', function (data)
{
    var userid = data.room.metadata.current_dj;
    var songID = data.room.metadata.current_song._id;
    var moddy = isMod(userid);
    var botty = isBot(userid);
    modHandling(moddy, botty, songID);
});

//RandomAutobop function
bot.on('newsong', function (data) { voteAutomaticallyButAtRandomTime(this, data); });

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//All functions listed below for scripts or calls

//Function for requesting a large random wait number
function randomNum()
{
    var waitTime = Math.floor(Math.random() * 1000 * 60 * 45);
    return waitTime;
};

//Function for doing the quote call and verifying that the function is authorized
function timeToQuote()
{
    if (sayQuotes === true)
    {
        console.log("*** Starting quote timer of " + time + " ***");
        getQuote();
        time = randomNum();
    }
    else
    {
        console.log("*** Sending quotes is currently off. Will check again in " + time + " ***");
        time = randomNum();
    }
};

//Function to do the randome bot vote
function voteAutomaticallyButAtRandomTime(caller, data)
{
    var maxWaitSeconds = 600;
    var oneSecond = 1000;
    setTimeout(function ()
    {
        caller.vote('up');
    }, Math.floor(Math.random() * maxWaitSeconds) * oneSecond);
};

//Function to run the check that the user is a moderator
function isMod(user)
{
    for (i = 0; i < moderators.length; i++)
    {
        if (user === moderators[i])
        {
            //console.log("This is a moderator. I'm not adding this song.");
            return true;
        }
    }
};

//Function to run the check that the user is a bot
function isBot(user)
{
    for (i = 0; i < BOTS.length; i++)
    {
        if (user === BOTS[i])
        {
            //console.log("This is a bot.");
            return true;
        }
    }
};

//Function of what to do if the user is not a moderator and adding a song
function modHandling(isMod, isBot, song)
{
    if (isMod !== true && isBot !== true)
    {
        bot.playlistAdd(song);
        console.log('I just expanded my song library in my queue. Joy! Song: ' + song);
        bot.playlistAll(function (playlist)
        {
            bot.playlistReorder(0, 1000);
        }
      );
        mixItUp();
        console.log('I\'m reordering my song library now');
    }
};

//Song re-organizing. Runs 25 times using random numbers.
function mixItUp()
{
    //Variable used for storing the logging of what song was moved where.  Commented out after testing verified the code works but will keep for future reference.
    //var taskDone = "";
    bot.playlistAll(function (playlist)
    {
        var listCount = playlist.list.length;
        for (i = 0; i < 50; i++)
        {
            var start = Math.floor(Math.random() * 100);
            var end = Math.floor(Math.random() * listCount);
            bot.playlistReorder(start, end);
            //Setting of the variable to store what occurred and returning it via console. Commented out after testing verified the code works but will keep for future reference.
            //taskDone = ("Moved song at position " + start + " to position " + end);
            //console.log(taskDone);
        }
    }
);
};

//Pulling of a random quote to spit out in the chat room
function getQuote()
{
    var fileName = 'quotes.txt';
    var quotes = [];
    fs.readFile(fileName, 'utf8', function (err, data)
    {
        if (err)
        {
            console.log(err);
        }
        quotes = data.split('|');
        bot.speak(quotes[Math.floor(Math.random() * quotes.length)]);
    });
};

//Listing of bot responses to chatter
function chatter(name, text, userid, moddy, botty, source)
{
    if (botty !== true)
    {
        switch (text)
        {

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
                setTimeout(function ()
                {
                    bot.speak("I'm not too sure shuga...");
                    console.log("Awaiting Bot response");
                }, 5000);
                break;

            case '_register':
                if (moddy !== true)
                {
                    bot.speak('Oh hiya there @' + name + '! How have ya been shuga. Make yourself comfy and play whatcha wanna but dontcha anger Mr. J!');
                    console.log(name + " = " + userid + " just entered the room.");
                }
                break;

            case '_adios':
                if (moddy !== true)
                {
                    bot.speak('Guess we gots ourselves another quitter. FINE @' + name + '!!! Dont let the door hit ya where Mr. J shived ya!!!');
                    console.log(name + ' \= ' + userid + ' has departed');
                }
                break;

            case 'quote':
                getQuote();
                break;

                //Turns off the auto quoting function
            case '/stopQuote':
                if (source === 'public')
                {
                    bot.speak("Fine... I keep these gems to myself :-P");
                }
                else if (source === 'pm')
                {
                    bot.pm("Fine... I keep these gems to myself :-P", userid);
                }
                sayQuotes = false;
                console.log("Quoting has been turned off");
                break;

                //Turns the auto quoting function on
            case '/startQuote':
                if (source === 'public')
                {
                    bot.speak("Oh you'll love these shuga! ;-)");
                }
                else if (source === 'pm')
                {
                    bot.pm("Oh you'll love these shuga! ;-)", userid);
                }
                sayQuotes = true;
                console.log("Quoting has been turned on");
                break;

                //Responses with a bot action which is mostly DJ related at this time
            case '/scram':
                if (moddy === true)
                {
                    bot.remDj();
                }
                if (source === 'public')
                {
                    bot.speak("All yours puddin");
                }
                else if (source === 'pm')
                {
                    bot.pm("All yours puddin", userid);
                }
                console.log("Bot is off the turntables");
                break;

            case '/junk':
                if (moddy === true)
                {
                    bot.playlistAll(function (playlist)
                    {
                        bot.playlistRemove(0);
                        console.log("The current song was removed");
                    }
                    );
                }
                if (source === 'public')
                {
                    bot.speak("We won't be hearing that any time soon... sorry Mr. J");
                }
                else if (source === 'pm')
                {
                    bot.pm("We won't be hearing that any time soon... sorry Mr. J", userid);
                }
                bot.stopSong();
                break;

            case '/skip':
                if (moddy === true)
                {
                    bot.stopSong();
                }
                console.log("The current song has been skipped");
                break;

            case '/spin':
                if (moddy === true)
                {
                    bot.addDj();
                }
                if (source === 'public')
                {
                    bot.speak("On it shuga");
                }
                else if (source === 'pm')
                {
                    bot.pm("On it shuga", userid);
                }
                console.log("Bot has been added to DJ");
                break;

            case 'remix':
                mixItUp();
                console.log("Requested playlist rearrangement completed");
                if (source === 'public')
                {
                    bot.speak("The deck's been reshuffled shuga ;-)");
                }
                else if (source === 'pm')
                {
                    bot.pm("The deck's been reshuffled shuga ;-)", userid);
                }
                break;

            case 'rock it':
                bot.vote('up');
                bot.speak("Turn it up!! :metal:");
                break;
        }
    }
};