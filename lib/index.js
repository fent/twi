#!/usr/bin/env node
var cmd = process.argv[2];

function usage() {
  console.log('usage: twi (tweet id|user screen_name [filter])');
}

var commands = require('./commands');
var command = commands[cmd];
if (!Object.prototype.hasOwnProperty.call(commands, cmd)) {
  console.log('unknown command');
  usage();
  process.exit(1);
}

if (command.length + 3 > process.argv.length) {
  console.log('not enough parameters');
  usage();
  process.exit(1);
}

command.apply(this, process.argv.slice(3));
