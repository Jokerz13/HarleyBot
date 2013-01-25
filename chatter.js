var harley = require('./chat_bot_harley.js');
var sayQuotes = true;

function chatter(name, text, userid, moddy, botty, source)
{
    if (botty !== true)
    {
        switch (text)
        {

            //General chatter responses  
            case ':metal:':
                harley.bot.speak("Git ya hand down before I chop it down!");
                break;

            case '/quiet':
                harley.bot.speak("Dontcha tell me to shut up or I'll shoot ya! hehe");
                break;

            case 'hello':
                harley.bot.speak("Hey there puddin! How are ya?");
                break;

            case 'thoughts':
                setTimeout(function ()
                {
                    harley.bot.speak("I'm not too sure shuga...");
                    console.log("Awaiting Bot response");
                }, 5000);
                break;

            case '_register':
                if (moddy !== true)
                {
                    harley.bot.speak('Oh hiya there @' + name + '! How have ya been shuga. Make yourself comfy and play whatcha wanna but dontcha anger Mr. J!');
                    console.log(name + " = " + userid + " just entered the room.");
                }
                break;

            case '_adios':
                if (moddy !== true)
                {
                    harley.bot.speak('Guess we gots ourselves another quitter. FINE @' + name + '!!! Dont let the door hit ya where Mr. J shived ya!!!');
                    console.log(name + ' \= ' + userid + ' has departed');
                }
                break;

            case 'quote':
                harley.getQuote();
                break;

                //Turns off the auto quoting function
            case '/stopQuote':
                if (source === 'public')
                {
                    harley.bot.speak("Fine... I keep these gems to myself :-P");
                }
                else if (source === 'pm')
                {
                    harley.bot.pm("Fine... I keep these gems to myself :-P", userid);
                }
                sayQuotes = false;
                console.log("Quoting has been turned off");
                break;

                //Turns the auto quoting function on
            case '/startQuote':
                if (source === 'public')
                {
                    harley.bot.speak("Oh you'll love these shuga! ;-)");
                }
                else if (source === 'pm')
                {
                    harley.bot.pm("Oh you'll love these shuga! ;-)", userid);
                }
                sayQuotes = true;
                console.log("Quoting has been turned on");
                break;

                //Responses with a bot action which is mostly DJ related at this time
            case '/scram':
                if (moddy === true)
                {
                    harley.bot.remDj();
                }
                if (source === 'public')
                {
                    harley.bot.speak("All yours puddin");
                }
                else if (source === 'pm')
                {
                    harley.bot.pm("All yours puddin", userid);
                }
                console.log("Bot is off the turntables");
                break;

            case '/junk':
                if (moddy === true)
                {
                    harley.bot.playlistAll(function (playlist)
                    {
                        harley.bot.playlistRemove(0);
                        console.log("The current song was removed");
                    }
                    );
                }
                if (source === 'public')
                {
                    harley.bot.speak("We won't be hearing that any time soon... sorry Mr. J");
                }
                else if (source === 'pm')
                {
                    harley.bot.pm("We won't be hearing that any time soon... sorry Mr. J", userid);
                }
                harley.bot.stopSong();
                break;

            case '/skip':
                if (moddy === true)
                {
                    harley.bot.stopSong();
                }
                console.log("The current song has been skipped");
                break;

            case '/spin':
                if (moddy === true)
                {
                    harley.bot.addDj();
                }
                if (source === 'public')
                {
                    harley.bot.speak("On it shuga");
                }
                else if (source === 'pm')
                {
                    harley.bot.pm("On it shuga", userid);
                }
                console.log("Bot has been added to DJ");
                break;

            case 'remix':
                harley.mixItUp();
                if (source === 'public')
                {
                    harley.bot.speak("The deck's been reshuffled shuga ;-)");
                }
                else if (source === 'pm')
                {
                    harley.bot.pm("The deck's been reshuffled shuga ;-)", userid);
                }
                break;

                //This switch is to output the bot's playlist
            case 'songs':
                if (source === 'public' && userid === myID)
                {
                    harley.collection();
                    harley.bot.speak("Here's what I got shuga");
                }
                else if (source === 'pm' && userid === myID)
                {
                    harley.collection();
                    harley.bot.pm("Here's what I got shuga", userid);
                }
                break;

            case 'rock it':
                harley.bot.vote('up');
                harley.bot.speak("Turn it up!! :metal:");
                break;

            default:
                if (source === 'public')
                {
                    //Do nothing at this time since it will address any chatter going on
                }
                else if (source === 'pm')
                {
                    harley.bot.pm("Oh... whisper something else to me sweetie.", userid);
                }
                break;
        }
    }
};

module.exports = chatter;