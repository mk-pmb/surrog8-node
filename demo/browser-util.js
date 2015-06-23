/* -*- coding: UTF-8, tab-width: 2 -*- */
/*jslint indent: 2, maxlen: 80, continue: true, unparam: true, browser: true */
'use strict';

window.require = function (module) { return window[module]; };

console.log = function (msg) {
  if ('string' === typeof msg) {
    msg = msg.replace(/^(=== )/, '\n$1');
  } else {
    msg = JSON.stringify(msg, null, 2);
    if (msg.length < 80) { msg = msg.replace(/\n */g, ' '); }
  }
  document.getElementsByTagName('pre')[0
    ].appendChild(document.createTextNode('\n' + msg));
};
