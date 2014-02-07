var request = require('./request');
var resources = {
  tweet: 'statuses/show.json?id=',
  username: 'users/show.json?screen_name=',
  userid: 'users/show.json?user_id=',
};


/**
 * @param {String} id
 * @param {!String} templateStr
 */
exports.tweet = function(id) {
  getOneResource(resources.tweet, id, arguments[1]);
};


/**
 * @param {String} username
 * @param {!String} templateStr
 */
exports.username = function(username) {
  getOneResource(resources.username, username, arguments[1]);
};


/**
 * @param {String} id
 * @param {!String} templateStr
 */
exports.userid = function(username) {
  getOneResource(resources.userid, username, arguments[1]);
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
  request(resource, id, template);
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
      request(resources.username, rs[1], template);
    }
  });
};
