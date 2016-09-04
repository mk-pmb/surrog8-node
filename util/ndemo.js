/*jslint indent: 2, maxlen: 80, continue: false, unparam: false, node: true */
/* -*- tab-width: 2 -*- */
'use strict';

var EX = module.exports;

EX.valuesSortedByName = function (obj) {
  return Object.keys(obj).sort().map(function (key) { return obj[key]; });
};

EX.chap = function (c) { console.log('\n===', c, '==='); };
