-*- coding: utf-8, tab-width: 2 -*-

surrog8
=======
Finally, a Unicode surrogate pair converter…
  * … whose magic numbers are carried in constants with meaningful names.
    * I discovered [codepoint](https://www.npmjs.com/package/codepoint)
      only after writing my own. As of version 0.0.0 (2015-03-02) it seems
      to not have CLI support yet.
  * … with a CLI wrapper that translates its arguments or stdin to `\uHHHH`
    and actually works on current versions of Ubuntu.
  * … with WYSIWYG all-in-one source code that can act as
    * an [AMD module][wp-amd]
    * a [CommonJS module][wp-cjs]
    * a browser `window` object extender


Usage
-----
[In node.js](demo/animals.node.js):
```javascript
var sg = require('surrog8'), cl = console.log, D = require('../util/ndemo'),
  animals = { cow: '🐄', ram: '🐏', dog: '🐕', bug: '🐛' }, notCow,
  dingbats = { sparkles: '✨' },
  dogEyes = 'My ' + animals.dog + "'s eyes "  + dingbats.sparkles + '.';
animals.all = D.valuesSortedByName(animals).join(' ');

D.chap('Console font test:');
cl(animals.all);      //= `🐛 🐄 🐕 🐏`

D.chap('Basic character operations:');
cl(sg.ord(animals.cow));          //= `128004`
cl(sg(animals.cow));              //= `128004`
notCow = String.fromCharCode(128004);
cl(notCow);                       //= ``  // something strange, now a cow.
cl(sg.chr(128004));               //= `🐄` // cow character
cl(sg(128004));                   //= `🐄` // cow character
cl(sg.uHHHH(animals.cow));        //= `\uD83D\uDC04`
cl(sg.uHHHH(128004));             //= `\uD83D\uDC04`
cl(sg.uHHHH(notCow));             //= `\uF404`
cl(sg.isSurrogateChar(notCow));   //= `false`

D.chap('String operations for the web:');
cl(sg.xml(dogEyes));    //= `My &#128021;&#39;s eyes &#10024;.`
cl(sg.css(dogEyes));    //= `My \1f415 \27 s eyes \2728 .`
cl(sg.esc(dogEyes,      //= `My [o=372025]'s eyes [o=23450].`
  { prefix: '[o=', base: 8, suffix: ']' }));
cl(sg.css('\\n=\n?'));  //= `\5c n=\0a ?` // test: avoid confusion with \a

D.chap('Advanced escaping:');
cl(sg.esc(animals.bug,  { base:  16 })); //= `1F41B`
cl(sg.esc(animals.bug,  { base: -16 })); //= `1f41b`
cl(sg.esc(128027,       { base: -16 })); //= `1f41b`
cl(sg.css(128027));                      //= `\1f41b `
cl(sg.xml(0x1f41b));                     //= `&#128027;`

D.chap('Useful regexps:');
function replAnm(rx, t) { return sg.uHHHH(animals.all.replace(rx, t)); }
cl(replAnm(sg.consts.rxAllHighSrg, '^')); //= `^\uDC1B ^\uDC04 ^\uDC15 ^\uDC0F`
cl(replAnm(sg.consts.rxAllLowSrg, '_'));  //= `\uD83D_ \uD83D_ \uD83D_ \uD83D_`
cl(replAnm(sg.consts.rxAllPairs, 'P'));   //= `P P P P`
```

In a browser:
```html
<pre id="cow">&#128004;</pre>
<script src="../sg8.js"></script>
<script>
var cow = document.getElementById('cow').innerHTML, sg = window.surrog8;
console.log({
  chr:    sg.chr(128004), // '🐄' (cow character)
  ord:    sg.ord(cow),    // 128004
  uHHHH:  sg.uHHHH(cow),  // '\uD83D\uDC04'
  css:    sg.css(cow),    // '\1f404 '
  xml:    sg.xml(cow),    // '&#128004;'
});
</script>
```
  * `window.surrog8.noConflict()`: In `window` object extender mode,
    reset `window.surrog8` to what it was before and return the
    `surrog8` function.

On the command line:
```bash
$ printf '( \xF0\x9F\x9A\x9D )\n( \xF0\x9F\x9A\x9F )\n'
( 🚝 )
( 🚟 )
$ printf '( \xF0\x9F\x9A\x9D )\n( \xF0\x9F\x9A\x9F )\n' | surrog8-js
( \uD83D\uDE9D )
( \uD83D\uDE9F )
$ surrog8-js "$(printf '( \xF0\x9F\x9A\x9D )\n( \xF0\x9F\x9A\x9F )\n')"
( \uD83D\uDE9D )\u000A( \uD83D\uDE9F )
# ^-- the trailing newline was stripped by bash.
$ surrog8-js 'Ae=Ä Oe=Ö Ue=Ü' 'ae=ä oe=ö ue=ü' sz=ß
Ae=\u00C4 Oe=\u00D6 Ue=\u00DC
ae=\u00E4 oe=\u00F6 ue=\u00FC
sz=\u00DF
```


Basic character operations
--------------------------
* `sg(codePointNumber | surrogatePairStr)`:
  Guess `.chr` or `.ord` based on parameter type.
* `sg.chr(codePointNumber)`:
  Return the character with the given CPN as a string.
  It might be represented as a surrogate pair.
* `sg.ord(surrogatePairStr)`
  Find the CPN of the first character in the string.
  If the string starts with a surrogate pair, it is treated as one character.
* `sg.uHHHH(str)`
  Escape non-trivial characters in the string `str` as `\u` + four
  uppercase hex digits.
  This is what the CLI mode will produce as output,
  one output line per argument,
  or per input line if no arguments were given.
* `sg.isSurrogateChar(cNum)`:
  Return (num) `1` if the codepoint is a high surrogate (`1`),
  (num) `2` for low surrogates, (bool) `false` if none.

String operations for the web
-----------------------------
* `sg.esc(data, opts)`:
  Escape non-trivial characters in `data`,
  which should be a string or a (code point) number.
  Available options, all optional:
  * `prefix`: (str) Text to put left of the CPN.
  * `suffix`: (str) Text to put right of the CPN.
  * `base`: (int) Base in which to express the CPN.
    Defaults to 10, use 16 or -16 for hexadecimal.
    The sign is stripped for the actual number conversion,
    it just denotes whether letters shall be uppercase (+) or lowercase (-).
  * `minlen`: (int) Minimum number of digits for the CPN.
  * `padding`: (str) Which character to repeat left of the CPN if it's
    shorter than `minlen`. Defaults to `'0'`.
  * `preEscape`: (rgx) Before escaping the usual suspects,
    escape the single characters matched by this regular expression.
    Surrogate pairs are valid single characters, but they'll be escaped
    anyway so you probably don't need to care.
    You'll rather want to catch parts of your prefix and suffix with this.
    Also, you'll probably want to set the `g` flag on this regexp.
* `sg.css(data)`: pre-configured `.esc` for Cascading Style Sheets.
* `sg.xml(data)`: pre-configured `.esc` for XML or (X)HTML.


Constants
---------
```javascript
  sg.consts = c = {
    highSrgStart: 0xD800,
    highSrgEnd:   0xDBFF,
    lowSrgStart:  0xDC00,
    lowSrgEnd:    0xDFFF,
    overFFFFh:    0x10000,
    rxAllHighSrg: /[\uD800-\uDBFF]/g,
    rxAllLowSrg:  /[\uDC00-\uDFFF]/g,
    rxAllPairs:   /[\uD800-\uDBFF][\uDC00-\uDFFF]/g,
  };
  c.lowSrgCnt = c.lowSrgEnd + 1 - c.lowSrgStart;      // 1024 = 0x400
  // trivia:
  c.highSrgCnt = c.highSrgEnd + 1 - c.highSrgStart;   // 1024
  c.maxPairCnt = c.highSrgCnt * c.lowSrgCnt;          // 1048576  = 0x100000
  c.expansionFactor = c.maxPairCnt / c.overFFFFh;     // 16       // ^654321
```



Internal helpers
----------------
Don't rely on them being available, or their interface.
* `sg.lpad(data, minlen, padding)`


License
-------
MIT



  [wp-amd]: http://en.wikipedia.org/wiki/Asynchronous_module_definition
  [wp-cjs]: http://en.wikipedia.org/wiki/CommonJS
