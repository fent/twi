var request = require('./request');
var resources = {
  tweet: 'statuses/show.json?id=',
  username: 'users/lookup.json?screen_name=',
  userid: 'users/lookup.json?user_id=',
};
var MULTI_LIMIT = 100;


/**
 * @param {String} id
 * @param {!String} templateStr
 */
exports.tweet = function(id) {
  getOneResource(resources.tweet, id, false, arguments[1]);
};


/**
 * @param {String} username
 * @param {!String} templateStr
 */
exports.username = function(username) {
  getOneResource(resources.username, username, true, arguments[1]);
};


/**
 * @param {String} id
 * @param {!String} templateStr
 */
exports.userid = function(username) {
  getOneResource(resources.userid, username, true, arguments[1]);
};


/**
 * @param {String} resource
 * @param {String} id
 * @param {Boolean} multi
 * @param {!String} templateStr
 */
function getOneResource(resource, id, multi, templateStr) {
  var template;
  if (templateStr) {
    var hogan = require('hogan.js');
    template = hogan.compile(templateStr);
  }

  if (multi) {
    var ids = id.split(',');
    if (ids.length > MULTI_LIMIT) {
      getMultiResource(resource, ids, templateStr);
      return;
    }
  }
  request(resource, id, template);
}


/**
 * @param {String} resource
 * @param {Array.<String>} ids
 * @param {String} tempalteStr
 */
function getMultiResource(resource, ids, templateStr) {
  var nexti;
  for (var i = 0, len = ids.length; i < len; i = nexti) {
    nexti = i + MULTI_LIMIT;
    request(resource, ids.slice(i, i + MULTI_LIMIT).join(','), templateStr);
  }
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

    var usernames = [];
    var i = 0;
    var rs;
    while (rs = USERNAME_REGEXP.exec(stdout)) {
      usernames[i++] = rs[1];
    }

    getMultiResource(resources.username, usernames, template);
  });
};
