#!/bin/sh

VERSION=$(
  cat package.json | 
  grep version | 
  head -1 |                 
  awk -F: '{ print $2 }' |  # Split by ":" and get the second part
  sed 's/[",]//g' |         # Remove quotes and commas
  tr -d '[[:space:]]'       # Remove spaces
)

echo "version=$VERSION"