#!/usr/bin/env node

var print = require( "sys" ).print,
	fs = require( "fs" ),
	src = fs.readFileSync( process.argv[2], "utf8" ),
	options = JSON.parse(fs.readFileSync("config.json", 'UTF-8')),
	version = options.JS_VERSION,
	js_name = options.JS_NAME,
	js_url  = options.JS_URL,
	js_license = options.JS_LICENSE
	// License Template
	license = "/*! @JS_NAME v@VERSION @JS_URL | @JS_LICENSE */";


// Previously done in sed but reimplemented here due to portability issues
src = src.replace( /^(\s*\*\/)(.+)/m, "$1\n$2" ) + ";";

// Set minimal license block var
license = license.replace( "@VERSION"   , version    )
                 .replace( "@JS_NAME"   , js_name    )
                 .replace( "@JS_URL"    , js_url     )
                 .replace( "@JS_LICENSE", js_license );

// Replace license block with minimal license
src = src.replace( /\/\/.*?\/?\*.+?(?=\n|\r|$)|\/\*[\s\S]*?\/\/[\s\S]*?\*\//, license );

print( src );
