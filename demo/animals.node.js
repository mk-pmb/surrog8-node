/* -*- coding: UTF-8, tab-width: 2 -*- */
/*jslint indent: 2, maxlen: 80, continue: true, unparam: true, node: true */
'use strict';

var sg = require('surrog8'), cl = console.log,
  animals = { cow: '🐄', ram: '🐏', dog: '🐕', bug: '🐛' },
  dingbats = { sparkles: '✨' },
  dogEyes = 'My ' + animals.dog + "'s eyes "  + dingbats.sparkles + '.';

cl('=== Console font test: ===');
cl(animals);   // let's hope your terminal font supports them

cl('=== Basic character operations: ===');
cl(sg.ord(animals.cow));          //= 128004
cl(sg(animals.cow));              //= 128004
cl(String.fromCharCode(128004));  //- something strange, now a cow.
cl(sg.chr(128004));               //= 🐄 // cow character
cl(sg(128004));                   //= 🐄 // cow character
cl(sg.uHHHH(animals.cow));        //= \uD83D\uDC04
cl(sg.uHHHH(128004));             //= \uD83D\uDC04

cl('=== String operations for the web: ===');
cl(sg.xml(dogEyes));    //= My &#128021;&#39;s eyes &#10024;.
cl(sg.css(dogEyes));    //= My \1f415 \27 s eyes \2728 .
cl(sg.esc(dogEyes,      //= My [o=372025]'s eyes [o=23450].
  { prefix: '[o=', base: 8, suffix: ']' }));
cl(sg.css('\\n=\n?'));  //= \5c n=\0a ? // test: avoid confusion with \a

cl('=== Advanced escaping: ===');
cl(sg.esc(animals.bug,  { base:  16 })); //= 1F41B
cl(sg.esc(animals.bug,  { base: -16 })); //= 1f41b
cl(sg.esc(128027,       { base: -16 })); //= 1f41b
cl(sg.css(128027));                      //="\1f41b "
cl(sg.xml(0x1f41b));                     //= &#128027;
