var resources = {
  tweet: 'statuses/show.json?id=',
  user: 'users/show.json?screen_name=',
};


/**
 * @param {String} id
 * @param {!String} templateStr
 */
exports.tweet = function(id) {
  var templateStr = arguments[1];
  var template;
  if (templateStr) {
    var hogan = require('hogan.js');
    template = hogan.compile(templateStr);
  }
  getResource(resources.tweet, id, template);
};


/**
 * @param {String} id
 * @param {!String} templateStr
 */
exports.user = function(username) {
  var templateStr = arguments[1];
  var template;
  if (templateStr) {
    var hogan = require('hogan.js');
    template = hogan.compile(templateStr);
  }
  getResource(resources.user, username, template);
};


/**
 * Gets the specified resource from Twitter, with an optional filter.
 *
 * @param {String} resource
 * @param {String} id
 * @param {String} template
 */
function getResource(resource, id, template) {
  var request = require('request');
  var oauth = require('./oauth')();
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

      if (template) {
        data = template.render(data);
      }
      console.log(data);
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
    var rs;
    while (rs = USERNAME_REGEXP.exec(stdout)) {
      getResource(resources.user, rs[1], template);
    }
  });
};
