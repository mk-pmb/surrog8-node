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
In node.js:
```js
var sg = require('surrog8'), cl = console.log,
  animals = { cow: '🐄', ram: '🐏', dog: '🐕', bug: '🐛' },
  dingbats = { sparkles: '✨' },
  dogEyes = 'My ' + animals.dog + "'s eyes "  + dingbats.sparkles + '.';

cl('=== Console font test: ===');
cl(animals);   // let's hope your terminal font supports them

cl('=== Basic character operations: ===');
cl(sg.ord(animals.cow));          // 128004
cl(sg(animals.cow));              // 128004
cl(String.fromCharCode(128004));  // something strange, now a cow.
cl(sg.chr(128004));               // 🐄 (cow character)
cl(sg(128004));                   // 🐄 (cow character)
cl(sg.uHHHH(animals.cow));        // \uD83D\uDC04
cl(sg.uHHHH(128004));             // \uD83D\uDC04

cl('=== String operations for the web: ===');
cl(sg.xml(dogEyes));    // My &#128021;&#39;s eyes &#10024;.
cl(sg.css(dogEyes));    // My \1f415 \27 s eyes \2728 .
cl(sg.esc(dogEyes,      // My [o=372025]'s eyes [o=23450].
  { prefix: '[o=', base: 8, suffix: ']' }));
cl(sg.css('\\n=\n?'));  // \5c n=\0a ? (avoid confusion with \a)

cl('=== Advanced escaping: ===');
cl(sg.esc(animals.bug,  { base:  16 })); // 1F41B
cl(sg.esc(animals.bug,  { base: -16 })); // 1f41b
cl(sg.esc(128027,       { base: -16 })); // 1f41b
cl(sg.css(128027));                      // \1f41b
cl(sg.xml(0x1f41b));                     // &#128027;
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
* `sg.css(data)`: pre-configured `.esc` for Cascading Style Sheets.
* `sg.xml(data)`: pre-configured `.esc` for XML or (X)HTML.

Internal helpers
----------------
Don't rely on them being available, or their interface.
* `sg.lpad(data, minlen, padding)`


License
-------
MIT



  [wp-amd]: http://en.wikipedia.org/wiki/Asynchronous_module_definition
  [wp-cjs]: http://en.wikipedia.org/wiki/CommonJS
