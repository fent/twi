var request   = require('request');
var TimeQueue = require('timequeue');
var oauth = require('./oauth');


var queue = new TimeQueue(function(resource, id, template, callback) {
  request.get({
    oauth: oauth(),
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
}, { concurrency: 1, every: 50 });


module.exports = function(resource, id, template) {
  queue.push(resource, id, template, function(err, data) {
    if (err) { return console.error(err.message); }
    console.log(data);
  });
};