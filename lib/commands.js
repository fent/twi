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
 * @param {Function(!Error, Object)} callback
 */
exports.tweet = function(id) {
  var templateStr = arguments[1];
  var callback = arguments[2];
  getOneResource(resources.tweet, id, false, templateStr, callback);
};


/**
 * @param {String} username
 * @param {!String} templateStr
 * @param {Function(!Error, Object)} callback
 */
exports.username = function(username) {
  var templateStr = arguments[1];
  var callback = arguments[2];
  getOneResource(resources.username, username, true, templateStr, callback);
};


/**
 * @param {String} id
 * @param {!String} templateStr
 * @param {Function(!Error, Object)} callback
 */
exports.userid = function(username) {
  var templateStr = arguments[1];
  var callback = arguments[2];
  getOneResource(resources.userid, username, true, templateStr, callback);
};


/**
 * @param {String} resource
 * @param {String} id
 * @param {Boolean} multi
 * @param {!String} templateStr
 * @param {Function(!Error, Object)} callback
 */
function getOneResource(resource, id, multi, templateStr, callback) {
  var template;
  if (typeof templateStr === 'function') {
    callback = templateStr;
    templateStr = null;
  } else if (templateStr) {
    var hogan = require('hogan.js');
    template = hogan.compile(templateStr);
  }

  if (multi) {
    var ids = id.split(',');
    if (ids.length > MULTI_LIMIT) {
      getMultiResource(resource, ids, template, callback);
      return;
    }
  }
  request(resource, id, template, callback);
}


/**
 * @param {String} resource
 * @param {Array.<String>} ids
 * @param {Function} tempalte
 * @param {Function(!Error, Object)} callback
 */
function getMultiResource(resource, ids, template, callback) {
  var nexti;
  for (var i = 0, len = ids.length; i < len; i = nexti) {
    nexti = i + MULTI_LIMIT;
    var reqids = ids.slice(i, i + MULTI_LIMIT).join(',');
    request(resource, reqids, template, callback);
  }
}


/**
 * Looks for Twitter usernames in the clipboard.
 *
 * @param {!String} templateStr
 * @param {Function(!Error, Object)} callback
 */
exports.clip = function() {
  var templateStr = arguments[0];
  var callback = arguments[1];
  if (typeof templateStr === 'function') {
    callback = templateStr;
    templateStr = null;
  }
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

    getMultiResource(resources.username, usernames, template, callback);
  });
};
