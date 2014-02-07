#!/usr/bin/env node
var cmd = process.argv[2];

function usage() {
  console.log('usage: twi <cmd> [template]');
  console.log('       twi tweet <id> [template]');
  console.log('       twi user <screen_name> [template]');
  console.log('       twi clip [template]');
}

var commands = require('../lib/commands');
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
