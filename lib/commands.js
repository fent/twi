var request = require('request');


/**
 * @param {String} id
 */
exports.tweet = function(id) {
  getResource('statuses/show.json?id=' + id);
};


/**
 * @param {String} id
 */
exports.user = function(username) {
  getResource('users/show.json?screen_name=' + username);
};


/**
 * @param {String} resource
 * @param {String} filter
 */
function getResource(resource, filter) {
  var oauth = require('./oauth')();
  request.get({
    oauth: oauth,
    url: 'https://api.twitter.com/1.1/' + resource,
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
}
