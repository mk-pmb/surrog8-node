#!/bin/bash
# -*- coding: utf-8, tab-width: 2 -*-
SELFPATH="$(readlink -m "$0"/..)"


function undoc_funcs () {
  cd "$SELFPATH"/.. || return $?

  local HAVE_DOC="$(grep -Pe '^\* `sg.' README.md)"
  echo 'in readme:'
  <<<"$HAVE_DOC" nl -ba

  local UNDOC='s~^\s+(sg\.\w+) = function \w*(\(.*) \{.*$~* `\1\2`~p'
  UNDOC="${UNDOC//\\w/[A-Za-z0-9_]}"
  UNDOC="$(sed -nre "$UNDOC" sg8.js | grep -vFe "$HAVE_DOC" | sort -V)"
  echo 'missing:'
  <<<"$UNDOC" nl -ba

  return 0
}










[ "$1" == --lib ] && return 0; undoc_funcs "$@"; exit $?
