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

command.apply(this, process.argv.slice(3));
