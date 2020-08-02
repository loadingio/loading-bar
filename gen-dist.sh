#!/usr/bin/env bash
N="./node_modules/.bin"
rm -r dist 2> /dev/null
mkdir -p dist
echo "build src/loading-bar.ls ..."
$N/lsc -cbp src/loading-bar.ls > dist/loading-bar-raw.js
echo "build src/presets.ls ..."
$N/lsc -cbp src/presets.ls > dist/presets.js
echo "build src/loading-bar.styl -> dist/loading-bar.css ..."
$N/stylus -p src/loading-bar.styl > dist/loading-bar.css
echo "bundle loading-bar ..."
$N/browserify dist/loading-bar-raw.js > dist/loading-bar.js
rm -f dist/loading-bar-raw.js
rm -f dist/presets.js

echo "minifying loading-bar.js ..."
$N/uglifyjs dist/loading-bar.js > dist/loading-bar.min.js
echo "minifying loading-bar.css ..."
$N/uglifycss dist/loading-bar.css > dist/loading-bar.min.css

echo "zip loading-bar.js and loading-bar.css ..."
zip -r dist/loading-bar.zip dist/loading-bar.js dist/loading-bar.css dist/loading-bar.min.js dist/loading-bar.min.css

echo "done."

