var fs = require('fs');
var path = require('path');
var env = process.env;
var twirc = path.resolve(env.HOME, '.twirc');
var oauth;

// See if there's a Twitter oauth pool file.
if (fs.existsSync(twirc)) {
  oauth = JSON.parse(fs.readFileSync(twirc, 'utf8'));
} else {
  oauth = {
    consumer_key    : env.TWITTER_CONSUMER_KEY,
    consumer_secret : env.TWITTER_CONSUMER_SECRET,
    token           : env.TWITTER_TOKEN,
    token_secret    : env.TWITTER_TOKEN_SECRET,
  };
}


/**
 * Returns a random oauth (if pool is available).
 * @return {Object}
 */
module.exports = function() {
  return Array.isArray(oauth) ?
    oauth[~~(Math.random() * oauth.length)] : oauth;
};
