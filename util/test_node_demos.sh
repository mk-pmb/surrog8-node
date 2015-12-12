#!/bin/bash
# -*- coding: utf-8, tab-width: 2 -*-
SELFPATH="$(readlink -m "$0"/..)"


function test_node_demos () {
  cd "$SELFPATH"/../demo || return $?
  export LANG{,UAGE}=C
  export LC_ALL="$LANG"
  local TEST_CNT=0
  local FAIL_CNT=0
  local TEST_FN=
  local RSLT_BFN=
  local TEST_RV=
  local EXPECTED=
  local VAR_DEFS=
  local IGNORES=

  for TEST_FN in *.node.js; do
    [ -f "$TEST_FN" ] || conitnue
    let TEST_CNT="$TEST_CNT+1"
    VAR_DEFS="$(sed -re '
      s~[,;]$~~
      /^(var| ) ([a-z]+)\s+=\s/!d
      s~^(var|)\s+(\S+)\s+=\s+~\2\n~
      s~\n(\{.*\})~\t\1~
      s~\n(\x22.*\x22)~\t\1~
      /\n/d
      s~[^A-Za-z0-9 _:,\t]~\\&~g
      s~^(\S+)\s(.*)$~s!^cl\\(\1\\);.*$!\2!p~
      ' -- "$TEST_FN")"
    EXPECTED="$(sed -re '
      s~\s+// .*$~~g
      s~^cl\(\x27(=.*=)\x27\);.*$~\1~p
      '"$VAR_DEFS"'
      /^cl\(\S+\(/!d
      /\s\/{2}\-/s~^.*$~\r~
      s~^.*\s+//=(\x22|\s+)~\r\1~
      /\r\x22/s~\x22$~~
      s~^\r(\s+|\x22)~~
      ' -- "$TEST_FN")"
    IGNORES="$(<<<"$EXPECTED" sed -nre '/^\r/=' | sed -re '
      s!$!s~^.*$~[…]~!')"
    RSLT_BFN="${TEST_FN%.js}".test
    <<<"$EXPECTED" sed -re "$IGNORES" >"$RSLT_BFN".xpt
    nodejs "$TEST_FN" | sed -re "$IGNORES" >"$RSLT_BFN".log
    diff -sU 2 "$RSLT_BFN".{xpt,log} | tee "$RSLT_BFN".diff
    TEST_RV="${PIPESTATUS[0]}"
    if [ "$TEST_RV" == 0 ]; then
      rm -- "$RSLT_BFN".{xpt,log,diff}
    else
      let FAIL_CNT="$FAIL_CNT+1"
    fi
  done

  [ "$TEST_CNT" == 0 ] && return 1$(echo 'E: no tests found' >&2)
  if [ "$FAIL_CNT" == 0 ]; then
    echo "+OK $TEST_CNT"
  else
    echo "-ERR $FAIL_CNT/$TEST_CNT"
  fi
  return "$FAIL_CNT"
}












[ "$1" == --lib ] && return 0; test_node_demos "$@"; exit $?
