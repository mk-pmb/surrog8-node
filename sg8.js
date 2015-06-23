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
    return String(str).replace(surrog8_uHHHH.unsafe, surrog8_uHHHH.escape);
  };
  sg.uHHHH.unsafe = /[\x00-\x1F\x7F-\uFFFF]/g;
  sg.uHHHH.escape = function (cNum) {
    var hex;
    if ('number' !== typeof cNum) { cNum = String(cNum).charCodeAt(0); }
    hex = cNum.toString(16).toUpperCase();
    return ('\\u' + '0000'.substr(hex.length, 4) + hex);
  };


  sg.lpad = function (data, minlen, padding) {
    if (data.length >= (minlen || 0)) { return data; }
    return ((0).toFixed(minlen).replace(/\S/g, (padding || '0')
      ).substr(0, minlen - data.length) + data);
  };


  sg.srgPairRgxFrag = ('[' + sg.uHHHH.escape(c.highSrgStart) + '-' +
                             sg.uHHHH.escape(c.highSrgEnd) + ']' +
                       '[' + sg.uHHHH.escape(c.lowSrgStart) + '-'
                           + sg.uHHHH.escape(c.lowSrgEnd) + ']');

  sg.esc = function hexEscape(data, opts) {
    var rgx;
    if (!opts) { opts = {}; }
    if ('number' === typeof data) {
      data = data.toString(Math.abs(opts.base || 10));
      data = ((opts.base < 0) ? data.toLowerCase() :  data.toUpperCase());
      if (opts.minlen) { data = sg.lpad(data, opts.minlen, opts.padding); }
      return ((opts.prefix || '') + data + (opts.suffix || ''));
    }
    data = String(data);
    rgx = new RegExp(sg.srgPairRgxFrag, 'g');
    rgx.repl = function (pair) { return sg.esc(sg.ord(pair), opts); };
    if (opts.preEscape) { data = data.replace(opts.preEscape, rgx.repl); }
    data = data.replace(rgx, rgx.repl);
    data = data.replace(sg.uHHHH.unsafe, rgx.repl);
    return data;
  };

  sg.css = function cssEscape(data) { return sg.esc(data, sg.css.opts); };
  sg.css.opts = { prefix: '\\', base: -16, suffix: ' ', preEscape: /\\|'|"/g,
    minlen: 2,  /* "\n" -> "\0a" avoids confusion with "\a". */
    };

  sg.xml = function xmlEscape(data) { return sg.esc(data, sg.xml.opts); };
  sg.xml.opts = { prefix: '&#', base: 10, suffix: ';', preEscape: /[&<>'"]/g };












  return sg;
}));