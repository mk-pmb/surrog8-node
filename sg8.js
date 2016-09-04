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
    rxAllHighSrg: /[\uD800-\uDBFF]/g,
    rxAllLowSrg:  /[\uDC00-\uDFFF]/g,
    rxAllPairs:   /[\uD800-\uDBFF][\uDC00-\uDFFF]/g,
  };
  c.lowSrgCnt = c.lowSrgEnd + 1 - c.lowSrgStart;


  sg.isSurrogateChar = function (cNum) {
    if ('string' === typeof cNum) { cNum = cNum.charCodeAt(0); }
    if ('number' !== typeof cNum) { return false; }
    if ((cNum >= c.highSrgStart) && (cNum <= c.highSrgEnd)) { return 1; }
    if ((cNum >= c.lowSrgStart) && (cNum <= c.lowSrgEnd)) { return 2; }
    return false;
  };


  sg.ordShim = function surrog8_ord(surrogatePairStr, pos) {
    var cNum1 = surrogatePairStr.charCodeAt(pos), cNum2, codePointNumber;
    if (sg.isSurrogateChar(cNum1) !== 1) { return cNum1; }
    cNum2 = surrogatePairStr.charCodeAt(pos + 1);
    if (sg.isSurrogateChar(cNum2) !== 2) { return cNum1; }
    /* strip their surrogate range offsets */
    cNum1 -= c.highSrgStart;
    cNum2 -= c.lowSrgStart;
    /* shift the high number part into the range it represents */
    cNum1 *= c.lowSrgCnt;
    /* compose original CPN */
    codePointNumber = cNum1 + cNum2 + c.overFFFFh;
    return codePointNumber;
  };
  sg.ord = (((typeof String.prototype.codePointAt) === 'function')
    ? function ord(s, i) { return String(s).codePointAt(i); } : sg.chrShim);


  sg.chrShim = function surrog8_chr(codePointNumber) {
    var cNum1, cNum2, shifted;
    if (arguments.length > 1) {
      cNum1 = '';
      for (cNum2 = 0; cNum2 < arguments.length; cNum2 += 1) {
        cNum1 += surrog8_chr(arguments[cNum2]);
      }
      return cNum1;
    }
    if (codePointNumber < c.overFFFFh) {
      /* CPN is in low range so we don't need a surrogate pair. */
      return String.fromCharCode(codePointNumber);
    }
    /* shift codepoint numbers to start counting in high range */
    shifted = codePointNumber - c.overFFFFh;
    /* split the (possibly large) code point number into smaller numbers */
    cNum1 = Math.floor(shifted /  c.lowSrgCnt);
    cNum2 = (shifted % c.lowSrgCnt);
    /* add both CPN parts into surrogate range */
    cNum1 += c.highSrgStart;
    cNum2 += c.lowSrgStart;
    return String.fromCharCode(cNum1, cNum2);
  };
  sg.chr = (((typeof String.fromCodePoint) === 'function')
    ? String.fromCodePoint.bind(String) : sg.chrShim);

  sg.uHHHH = function surrog8_uHHHH(str) {
    if ('number' === typeof str) { str = sg.chr(str); }
    return String(str).replace(surrog8_uHHHH.unsafe, surrog8_uHHHH.escape);
  };
  sg.uHHHH.unsafe = /[\x00-\x1F\x7F-\uFFFF]/g;
  sg.uHHHH.escape = function (cNum) {
    if ('number' !== typeof cNum) { cNum = String(cNum).charCodeAt(0); }
    cNum = cNum.toString(16).toUpperCase();
    return ('\\u' + '0000'.substr(cNum.length, 4) + cNum);
  };


  sg.lpad = function (data, minlen, padding) {
    if (data.length >= (minlen || 0)) { return data; }
    return ((0).toFixed(minlen).replace(/\S/g, (padding || '0')
      ).substr(0, minlen - data.length) + data);
  };


  sg.esc = function hexEscape(data, opts) {
    var escFunc;
    if (!opts) { opts = {}; }
    if ('number' === typeof data) {
      data = data.toString(Math.abs(opts.base || 10));
      data = ((opts.base < 0) ? data.toLowerCase() :  data.toUpperCase());
      if (opts.minlen) { data = sg.lpad(data, opts.minlen, opts.padding); }
      return ((opts.prefix || '') + data + (opts.suffix || ''));
    }
    data = String(data);
    escFunc = function (pair) { return sg.esc(sg.ord(pair), opts); };
    if (opts.preEscape) { data = data.replace(opts.preEscape, escFunc); }
    data = data.replace(c.rxAllPairs, escFunc);
    data = data.replace(sg.uHHHH.unsafe, escFunc);
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