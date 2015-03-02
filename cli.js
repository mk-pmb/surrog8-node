#!/usr/bin/env nodejs
/* -*- coding: UTF-8, tab-width: 2 -*- */
/*jslint indent: 2, maxlen: 80, continue: true, unparam: true, node: true */
'use strict';

var sg = require('./sg8'), argv = process.argv.slice(2);

if (argv.length) {
  argv.forEach(function (arg) { console.log(sg.uHHHH(arg)); });
} else {
  process.stdin.on('data', function (chunk) {
    process.stdout.write(String(chunk).split(/\n/).map(sg.uHHHH).join('\n'));
  });
}
