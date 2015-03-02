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
```js
var sg = require('surrog8'), cl = console.log,
  animals = { cow: '🐄', ram: '🐏', dog: '🐕' };
cl(animals);   // let's hope your terminal font supports them
cl(sg.ord(animals.cow));          // 128004
cl(sg(animals.cow));              // 128004
cl(String.fromCharCode(128004));  // something strange, now a cow.
cl(sg.chr(128004));               // 🐄 (cow character)
cl(sg(128004));                   // 🐄 (cow character)
cl(sg.uHHHH(animals.cow));        // \uD83D\uDC04
```


License
-------
MIT



  [wp-amd]: http://en.wikipedia.org/wiki/Asynchronous_module_definition
  [wp-cjs]: http://en.wikipedia.org/wiki/CommonJS
