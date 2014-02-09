var request   = require('request');
var TimeQueue = require('timequeue');
var env = process.env;


var queue = new TimeQueue(function(resource, id, template, callback) {
  request.get({
    oauth: {
      consumer_key    : env.TWITTER_CONSUMER_KEY,
      consumer_secret : env.TWITTER_CONSUMER_SECRET,
      token           : env.TWITTER_TOKEN,
      token_secret    : env.TWITTER_TOKEN_SECRET,
    },
    url: 'https://api.twitter.com/1.1/' + resource + id,
    json: true,
  }, function(err, res, data) {
      if (err) return callback(err);
      if (res.statusCode !== 200) {
        if (data && data.errors) {
          err = data.errors[0];
          err.errors = data.errors;
          callback(err);
          return;
        } else {
          callback(new Error('status code: ' + res.statusCode));
        }
        return;
      }

      if (template) {
        data = Array.isArray(data) ?
          data.map(function(data) { return template.render(data); }) :
          template.render(data);
      }
      callback(null, data);
  });
}, { concurrency: 1, every: 50 });


module.exports = function(resource, id, template, callback) {
  queue.push(resource, id, template, callback);
};
