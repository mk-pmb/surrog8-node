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


License
-------
MIT



  [wp-amd]: http://en.wikipedia.org/wiki/Asynchronous_module_definition
  [wp-cjs]: http://en.wikipedia.org/wiki/CommonJS
