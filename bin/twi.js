#!/usr/bin/env node
var cmd = process.argv[2];

function usage() {
  console.log('usage: twi <cmd> [template]');
  console.log('       twi tweet <id> [template]');
  console.log('       twi username <screen_name> [template]');
  console.log('       twi userid <id> [template]');
  console.log('       twi clip [template]');
  process.exit(1);
}

if (process.argv.length < 3) {
  usage();
}

var commands = require('../lib/commands');
var command = commands[cmd];
if (!Object.prototype.hasOwnProperty.call(commands, cmd)) {
  console.log('unknown command');
  usage();
}

if (command.length + 3 > process.argv.length) {
  console.log('not enough parameters');
  usage();
}

var args = process.argv.slice(3);
args.push(function(err, data) {
  if (err) { return console.error(err.message); }
  if (Array.isArray(data)) {
    data.forEach(function(d) { console.log(d); });
  } else {
    console.log(data);
  }
});
command.apply(this, args);
