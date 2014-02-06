var resources = {
  tweet: 'statuses/show.json?id=',
  user: 'users/show.json?screen_name=',
};


/**
 * @param {String} id
 * @param {!String} templateStr
 */
exports.tweet = function(id) {
  getOneResource(resources.tweet, id, arguments[1]);
};


/**
 * @param {String} id
 * @param {!String} templateStr
 */
exports.user = function(username) {
  getOneResource(resources.user, username, arguments[1]);
};


/**
 * @param {String} resource
 * @param {String} id
 * @param {!String} templateStr
 */
function getOneResource(resource, id, templateStr) {
  var template;
  if (templateStr) {
    var hogan = require('hogan.js');
    template = hogan.compile(templateStr);
  }
  getResource(resource, id, template, genericCallback);
}


/**
 * A generic callback that checks for an error.
 *
 * @param {!Error} err
 * @param {String|Object} data
 */
function genericCallback(err, data) {
  if (err) { return console.err(err.message); }
  console.log(data);
}


/**
 * Gets the specified resource from Twitter, with an optional filter.
 *
 * @param {String} resource
 * @param {String} id
 * @param {String} template
 * @param {Function(!Error, String|Object)} callback
 */
function getResource(resource, id, template, callback) {
  var request = require('request');
  var oauth = require('./oauth')();
  request.get({
    oauth: oauth,
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
        data = template.render(data);
      }
      callback(null, data);
  });
}


/**
 * Looks for Twitter usernames in the clipboard.
 */
exports.clip = function() {
  var templateStr = arguments[0];
  var exec = require('child_process').exec;

  // The lookahead is more not matching emails.
  var USERNAME_REGEXP = /(?:[^a-zA-Z0-9-_\.])@([A-Za-z]+[A-Za-z0-9]+)/g;
  exec('pbpaste', function(err, stdout) {
    if (err) throw err;

    var template;
    if (templateStr) {
      var hogan = require('hogan.js');
      template = hogan.compile(templateStr);
    }

    var TimeQueue = require('timequeue');
    var queue = new TimeQueue(function(resource, id, template, callback) {
      getResource(resource, id, template, callback);
    }, { concurrency: 1, every: 50 });

    var rs;
    while (rs = USERNAME_REGEXP.exec(stdout)) {
      queue.push(resources.user, rs[1], template, genericCallback);
    }
  });
};
