/* -*- coding: UTF-8, tab-width: 2 -*- */
/*jslint indent: 2, maxlen: 80, continue: true, unparam: true, node: true */
'use strict';

var sg = require('surrog8'), cl = console.log,
  animals = { cow: '🐄', ram: '🐏', dog: '🐕' };
cl(animals);   // let's hope your terminal font supports them
cl(sg.ord(animals.cow));          // 128004
cl(sg(animals.cow));              // 128004
cl(String.fromCharCode(128004));  // something strange, now a cow.
cl(sg.chr(128004));               // 🐄 (cow character)
cl(sg(128004));                   // 🐄 (cow character)
cl(sg.uHHHH(animals.cow));        // \uD83D\uDC04
cl(sg.uHHHH(128004));             // \uD83D\uDC04
