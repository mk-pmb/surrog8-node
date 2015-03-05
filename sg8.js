/* -*- coding: UTF-8, tab-width: 2 -*- */
/*jslint indent: 2, maxlen: 80, browser: true */
/*globals define:true*/
(function unifiedExport(moduleName, factory, exports, backup) {
  'use strict';
  if (('function' === typeof define) && define.amd) { return define(factory); }
  if (('object' === typeof module) && module && module.exports) {
    module.exports = factory();
    return;
  }
  if (('object' === typeof window) && window.navigator) {
    exports = factory();
    backup = window[moduleName];
    exports.noConflict = function (key) {
      window[moduleName] = backup;
      if (key) { window[key] = exports; }
      return exports;
    };
    window[moduleName] = exports;
  }
}('surrog8', function () {/*require, exports, module*/
  'use strict';
  var sg, c;
  sg = function surrog8(cpnOrStr) {
    if ('string' === typeof cpnOrStr) { return sg.ord(cpnOrStr); }
    if ('number' === typeof cpnOrStr) { return sg.chr(cpnOrStr); }
    throw new TypeError('surrog8 needs a number for chr or a string for ord.');
  };

  c = sg.consts = {
    highSrgStart: 0xD800,
    highSrgEnd:   0xDBFF,
    lowSrgStart:  0xDC00,
    lowSrgEnd:    0xDFFF,
    overFFFFh:    0x10000,
  };
  c.lowSrgCnt = c.lowSrgEnd + 1 - c.lowSrgStart;

  sg.ord = function surrog8_ord(surrogatePairStr) {
    var cNum1 = surrogatePairStr.charCodeAt(0), cNum2, codePointNumber;
    if (cNum1 < c.highSrgStart) { return cNum1; }
    if (cNum1 > c.highSrgEnd) { return cNum1; }
    cNum2 = surrogatePairStr.charCodeAt(1);
    if (cNum2 < c.lowSrgStart) { return cNum1; }
    if (cNum2 > c.lowSrgEnd) { return cNum1; }
    codePointNumber = ((cNum1 - c.highSrgStart) * c.lowSrgCnt) +
      (cNum2 - c.lowSrgStart) + c.overFFFFh;
    return codePointNumber;
  };

  sg.chr = function surrog8_chr(codePointNumber) {
    var cNum1, cNum2;
    if (codePointNumber < c.overFFFFh) {
      return String.fromCharCode(codePointNumber);
    }
    cNum1 = codePointNumber - c.overFFFFh;
    cNum2 = (cNum1 % c.lowSrgCnt) + c.lowSrgStart;
    cNum1 = Math.floor(cNum1 /  c.lowSrgCnt) + c.highSrgStart;
    return String.fromCharCode(cNum1, cNum2);
  };

  sg.uHHHH = function surrog8_uHHHH(str) {
    if ('number' === typeof str) { str = sg.chr(str); }
    return String(str).replace(/[\x00-\x1F\x7F-\uFFFF]/g, sg.uHHHH.escape);
  };
  sg.uHHHH.escape = function (match) {
    var cNum = match.charCodeAt(0), hex = cNum.toString(16).toUpperCase();
    return ('\\u' + '0000'.substr(hex.length, 4) + hex);
  };





  return sg;
}));