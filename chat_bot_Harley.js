var Bot    = require('../index');
var AUTH = '';
var USERID = '50b8227daaa5cd7d09020841';
var ROOMID = '50a25f660f812c777476c5df';

var bot = new Bot(AUTH, USERID, ROOMID);
var theUsersList = { };
var isOn = true;

bot.on('speak', function (data) {
  // Get the data
  var name = data.name;
  var text = data.text;
  var userid = data.userid;

  // Respond to "/hello" command
  //if (text.match(/^\/hello$/)) {
  //  bot.speak('Hey! How are you @'+name+'?');
    //}

  if (text.match(/:metal:/)) {
      bot.speak('Git ya hand down before I chop it down!');
  }

  //Respond to being told to be quiet
  if (text.match(/quiet/)) {
      bot.speak('Dontcha tell me to shut up or I\'ll shoot ya... hehe');
  }

  //Adding the bot to DJ
  if (text.match(/^\/spin$/)) {
	  console.log('I\'m gonna play some muzac');
	  if (userid === '50a40c6deb35c16670add650') {
	      bot.addDj();}
  }

  //Removing the bot from the turntables
  if (text.match(/^\/stop$/)) {
      console.log('I\'m done playing music for now');
      if (userid === '50a40c6deb35c16670add650') {
          bot.remDj();
      }
  }

  //Skipping the bot's current song
  if (text.match(/^\/skip$/)) {
      console.log('I\'m not feeling this song right now');
      if (userid === '50a40c6deb35c16670add650') {
          bot.stopSong();
      }
  }

    // Respond to "/hello" command
  if (text.match(/^\/hello$/)) {
      bot.speak('Hey there puddin! How are ya?!');
  }

    // Any command with "bop" in it will work (ex: "bop","bop i beg you!!!","lolbopbaby", etc.)
  if (text.match(/rock it/)) {
      bot.vote('up');
  }

  if (text.match(/the man/)) {
      bot.speak('Mr. J should be around here somewhere....');
  }

  if (text.match(/what do you think/)) {
      setTimeout(function () {
          bot.speak('I\'m not too sure shuga... I don\'t know if it\'s gonna make me shake my groove thang');
      }, 5000);
  }
  

  //The remix command the prompts the bot to reshuffle the top three songs in the queue on command
  if (text.match(/remix/)) {
      bot.playlistAll(function(playlist) {
          bot.playlistReorder(0, 1000);}
      );
      bot.playlistAll(function (playlist) {
          bot.playlistReorder(1, 1000);}
      );
      bot.playlistAll(function (playlist) {
          bot.playlistReorder(2, 1000);}
      );
      console.log('I\'m reordering my song library now');
      bot.speak('Okay... okay... changing things up!');
  }
  
});

//RandomeAutobop function
bot.on('newsong', function (data) { voteAutomaticallyButAtRandomTime (this, data);  });

bot.on('roomChanged', function (data) {
    // Reset the users list
    theUsersList = {};

    var users = data.users;
    for (var i = 0; i < users.length; i++) {
        var user = users[i];
        theUsersList[user.userid] = user;
    }
});

bot.on('registered', function (data) {
    var user = data.user[0];
    //var name = data.name;
    console.log(user.name + ' just entered the room.');
    if (user.userid != '50b8227daaa5cd7d09020841') {
        bot.speak('Oh hiya there @'+ user.name +'! How have ya been shuga. Make yourself comfy and play whatcha wanna but dontcha anger Mr. J!');
    }
});

bot.on('deregistered', function (data) {
    var user = data.user[0];
    console.log(user.name + ' has decided to leave our little tea party.');
    //delete theUsersList[user.userid];
    if (user.userid != '50b8227daaa5cd7d09020841') {
        bot.speak('Guess we gots ourselves another quitter. FINE @'+ user.name +'!!! Dont let the door hit ya where Mr. J shived ya!!!');
    }
});

    //function on newsong that adds newly played song to the top of the list and the reorders the top three songs in queue
bot.on('newsong', function (data) {
    var userid = data.userid;
    if (userid != '50b8227daaa5cd7d09020841') {
        songID = data.room.metadata.current_song._id;
        bot.playlistAdd(songID);
        console.log('I just expanded my song library in my queue. Joy!');
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
        console.log('I\'m reordering my song library now');
    }
});















//All functions listed below for scripts or calls

function voteAutomaticallyButAtRandomTime(caller, data) {
    var maxWaitSeconds = 600;
    var oneSecond = 1000;
    setTimeout(function () {
        caller.vote('up');
    }, Math.floor(Math.random() * maxWaitSeconds) * oneSecond);
}