#!/usr/bin/env node
var cmd = process.argv[2];
var id = process.argv[3];
var filter = process.argv[4];

function usage() {
  console.log('usage: twi (tweet|user) (id|screen_name) [filter]');
}

if (!id) {
  usage();
  process.exit();
}

var commands = {
  tweet: 'statuses/show.json?id=',
  user: 'users/show.json?screen_name=',
};
var resource = commands[cmd];
if (!resource) {
  console.log('unknown command');
  usage();
  process.exit(1);
}

// See if there's a Twitter oauth pool file.
var fs = require('fs');
var path = require('path');
var env = process.env;
var twirc = path.resolve(env.HOME, '.twirc');
var oauth;

if (fs.existsSync(twirc)) {
  oauth = JSON.parse(fs.readFileSync(twirc, 'utf8'));
  oauth = oauth[~~(Math.random() * oauth.length)];
} else {
  oauth = {
    consumer_key    : env.TWITTER_CONSUMER_KEY,
    consumer_secret : env.TWITTER_CONSUMER_SECRET,
    token           : env.TWITTER_TOKEN,
    token_secret    : env.TWITTER_TOKEN_SECRET,
  };
}

var request = require('request');

request.get({
  oauth: oauth,
  url: 'https://api.twitter.com/1.1/' + resource + id,
  json: true,
}, function(err, res, data) {
    if (err) throw err;
    if (res.statusCode !== 200) {
      if (data && data.errors) {
        data.errors.forEach(function(error) {
          console.error(error.message);
        });
      } else {
        console.error('status code: ' + res.statusCode);
      }
      return;
    }

    if (filter) {
      var o = {};
      var f = filter.split(',');
      for (var i = 0, len = f.length; i < len; i++) {
        var key = f[i];
        var value = data[key];
        if (typeof value !== 'undefined') {
          o[key] = value;
        }
      }
      console.log(o);
    } else {
      console.log(data);
    }
});
