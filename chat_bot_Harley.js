var Bot    = require('../index');
var AUTH = 'hDsRTNhBUpPZVlZypxNXKsCu';
var USERID = '50b8227daaa5cd7d09020841';
var ROOMID = '50a25f660f812c777476c5df';

var bot = new Bot(AUTH, USERID, ROOMID);
var theUsersList = { };
var isOn = true;

bot.on('speak', function (data) {
  // Get the data
  var name = data.name;
  var text = data.text;

  // Respond to "/hello" command
  //if (text.match(/^\/hello$/)) {
  //  bot.speak('Hey! How are you @'+name+'?');
    //}

  if (text.match(/:metal:/)) {
      bot.speak('Git ya hand down before I chop it down!');
  }

    // Respond to "/hello" command
  if (text.match(/^\/hello$/)) {
      bot.speak('Hey there puddin! How are ya?!');
  }

    // Any command with "bop" in it will work (ex: "bop","bop i beg you!!!","lolbopbaby", etc.)
  if (text.match(/rock it/)) {
      bot.vote('up');
  }

  if (text.match(/man/)) {
      bot.speak('Mr. J should be around here somewhere....');
  }

  if (text.match(/what do you think/)) {
      setTimeout(function () {
          bot.speak('I\'m not too sure shuga... I don\'t know if it\'s gonna make me shake my groove thang');
      }, 5000);
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

bot.on('newsong', function (data) {
    var userid = data.userid;
    if (userid != '50b8227daaa5cd7d09020841') {
        songID = data.room.metadata.current_song._id;
        bot.playlistAdd(songID);
        console.log('I just expanded my song library in my queue. Joy!');
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