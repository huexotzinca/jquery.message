[jQuery.Message](http://github.com/huexotzinca/jquery.message) - Javascript classes and jQuery plugin instance
==================================================

What you need to use jQuery.message
--------------------------------------

In order to build jQuery, you need to have GNU make 3.8 or later, Node.js 0.2 or later, and git 1.7 or later.
(Earlier versions might work OK, but are not tested.)

Windows users have two options:

1. Install [msysgit](https://code.google.com/p/msysgit/) (Full installer for official Git),
   [GNU make for Windows](http://gnuwin32.sourceforge.net/packages/make.htm), and a
   [binary version of Node.js](http://node-js.prcn.co.cc/). Make sure all three packages are installed to the same
   location (by default, this is C:\Program Files\Git).
2. Install [Cygwin](http://cygwin.com/) (make sure you install the git, make, and which packages), then either follow
   the [Node.js build instructions](https://github.com/ry/node/wiki/Building-node.js-on-Cygwin-%28Windows%29) or install
   the [binary version of Node.js](http://node-js.prcn.co.cc/).

Mac OS users should install Xcode (comes on your Mac OS install DVD, or downloadable from
[Apple's Xcode site](http://developer.apple.com/technologies/xcode.html)) and
[http://mxcl.github.com/homebrew/](Homebrew). Once Homebrew is installed, run `brew install git` to install git,
and `brew install node` to install Node.js.

Linux/BSD users should use their appropriate package managers to install make, git, and node, or build from source
if you swing that way. Easy-peasy.


How to build your own jQuery.message
----------------------------

First, clone a copy of the main jQuery git repo by running `git clone git://github.com/huexotzinca/jquery.message.git`.

Then, to get a complete, minified, jslinted version of jQuery, simply `cd` to the `jquery` directory and type
`make`. If you don't have Node installed and/or want to make a basic, uncompressed, unlinted version of jQuery.message, use
`make jquery` instead of `make`.

The built version of jQuery.message will be put in the main site like `jquery.message.js` and `jquery.message.min.js` of compressed form or can check the latest version in the `dist/` directory.


Use jquery.message in my page
---------------------------------

Puts this code in your html page

```html
  <link rel="stylesheet" href="jquery.message/jquery.message.css">
  <script src="jquery.message/jquery.message.min.js"></script>
```
And this javascript Runs the jQuery Message

```javascript

/* Ajax Message */
$.MSG.Ajax("My Ajax Message..."); //  for show a ajax message in your site
$.MSG.Ajax("off");                //  for hide the ajax message

/* Notice */
$.MSG.Notice("Message on the notice"); // show the notice message in the site and 
                                       //this will be closed automaticatly after 6 seconds
$.MSG.Notice(options);  // see jquery.message.js for full doc in options 
```

Questions?
----------

If you have any questions, please feel free to ask on the
[Neftali](mailto:hello@neftalibautista.com) or in [Site](http://www.neftalibautista.com)


