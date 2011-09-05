/**
  * jQuery notice plugin.
  *
  * @package    plugins
  * @see        http://www.huexotzinca.com/
  * @author     Neftali Bautista
  * @copyright  (c) 2011 Neftali Bautista
  * @license    http://lab.huexotzinca.com/license.html
  * @since      0.0.1
  */
(function($){
  $.fn.extend({
    /**
      * Creates a notice popup in the current page
      *
      * @method notice
      * @param {String} content Content of the current Notice message (This must be Text).
      * @param {Object} [options] Options for the Notice (For more info see Notice Class).
      */
    notice : function( content, options ) {
      var Noticer = $.data(this[0], 'Noticer');
      if ( !Noticer ) {
        Noticer = new $.Noticer( this[0], options );
        $.data(this[0], 'Noticer', Noticer);
      }
      if ( content || typeof content === 'string' ) {
        Noticer.createNotice( content, options );        
      }
      return Noticer;
    }
  });
  
  /**
    * Notice create a notice object and paste the container give it.
    *
    * @class Notice
    * @constructor
    * @param {jQuery Object} container
    * @param {String} content Content of the current Notice message (This must be Text).
    * @param {Object} [options] Options for the Notice this includes the CSS clasess and the type and timeout of the notice.
    * @param {String} [options.type] Type of the Notice this could be [info|success|error|warning|update|time|funny]
    * @param {Int} [options.timeout=5000] Timeout to hide the Notice, if this is 0 the notice not will disappear.
    * @param {String} [options.maincontainerclassname="notice-msg"] Classname for maincontainer.
    * @param {String} [options.containerclassname="container"] Classname for container.
    * @param {String} [options.contentclassname="content"] Classname for content.
    * @param {String} [options.successclassname="success"] Classname for the success type.
    * @param {String} [options.errorclassname="error"] Classname for the error type.
    * @param {String} [options.infoclassname="info"] Classname for the info type.
    * @param {String} [options.warningrclassname="warning"] Classname for the warning type.
    * @param {String} [options.timeclassname="time"] Classname for the time type.
    * @param {String} [options.upgradeclassname="upgrade"] Classname for the upgrade type.
    * @param {String} [options.funnyclassname="funny"] Classname for the funny type.
    */
  var Notice = function( container, content, options ) {
    this.settings = $.extend( true, {}, Notice.defaults, options );
    this.type = this.settings.type || "default";
    this.wrapper = $("<div></div>");
    this.content = $("<div></div>");
    this.currentContainer = container;
    this.init( content );
  };
    
  /////////////////////////////////////////////////////////////////////////////
  //
  // Defaults Notice variables and Public Functions
  //
  /////////////////////////////////////////////////////////////////////////////
  $.extend(Notice, {
    defaults : {
      maincontainerclassname : "notice-msg",
      containerclassname : "container",
      contentclassname : "content",
      successclassname : "success",
      errorclassname : "error",
      infoclassname : "info",
      warningrclassname : "warning",
      timeclassname : "time",
      upgradeclassname : "upgrade",
      funnyclassname : "funny",
      status : 1,
      timeout : 5000,
      callback : function(){},
      callinit : function(){},
      callshow : function(){},
      callhide : function(){}
    },
    setDefaults: function(settings) {
      $.extend( Notice.defaults, settings );
    },
    prototype : {
      /**
        * Init the Notice object
        *
        * @class Notice
        * @function init
        * @param {String} content The content text of the notice.
        */
      init : function( content ) {
        this.settings.callinit();
        this.buildBackground();
        this.setContent( content );
        this.convertTo( this.type );
      },
      /**
        * Hide call the callback function and remove Notice object from DOM
        *
        * @class Notice
        * @function destroy
        * @param {Function} callback Callback function for this event.
        * @param {Object} context Context of the Callback function. (callback.call(context))
        */
      destroy : function( callback, context ) {
        this.hide( true, callback, context );
      },
      /**
        * Remove Notice object from DOM
        *
        * @class Notice
        * @function destroyObject
        * @todo Remove object from the notices array, but this could be do by the garbage collector. 
        */
      destroyObject : function() {
        this.wrapper.remove();
      },
      /**
        * Set the text content of the Notice object.
        *
        * @class Notice
        * @function setContent
        * @param {String} content Content of the current Notice message (This must be Text).
        */
      setContent : function( content ) {
        this.content.html( content );
      },
      /**
        * Get the HTML wrapper element (main Notice container).
        *
        * @class Notice
        * @function getNoticeElement
        * @returns {jQuery.DOMELement} content Content of the current Notice message (This must be Text).
        */
      getNoticeElement : function() {
        return this.wrapper;
      },
      /**
        * Build the background of the element
        *
        * @class Notice
        * @function buildBackground
        */
      buildBackground : function() {
        this.currentContainer.addClass( this.settings.maincontainerclassname );
        this.content.addClass( this.settings.contentclassname );
        this.wrapper.append( this.content );
        this.currentContainer.append( this.wrapper );
      },
      /**
        * Change the CSS classes of the Notice element
        *
        * @class Notice
        * @function convertTo
        * @param {String} type The type of the Notice element.
        */
      convertTo : function( type ) {
        this.wrapper.removeClass();
        this.wrapper.addClass( this.settings.containerclassname );
        switch( type ) {
          case "success":
            this.wrapper.addClass( this.settings.successclassname );
          break;
          case "error":
            this.wrapper.addClass( this.settings.errorclassname );
          break;
          case "info":
            this.wrapper.addClass( this.settings.infoclassname );
          break;
          case "warning":
            this.wrapper.addClass( this.settings.warningrclassname );
          break;
          case "time":
            this.wrapper.addClass( this.settings.timeclassname );
          break;
          case "upgrade":
            this.wrapper.addClass( this.settings.upgradeclassname );
          break;    
          case "funny":
            this.wrapper.addClass( this.settings.funnyclassname );
          break;         
        }
      },
      /**
        * Display the notice element.
        *
        * @class Notice
        * @function show
        * @param {Boolean} destroyit If do you like remove wrapper element from DOM.
        * @param {Function} callback The callback function.
        * @param {Object} context Context of the callback fucntion. (callback.call(context)).
        */
      show : function(destroyit, callback, context ) {
        this.settings.callshow();
        var that = this;
        destroyit = (typeof destroyit !== "boolean") ? false : destroyit;
        this.wrapper.fadeIn(1200, function() {
            //$(this).css("opacity", "1");
            var fn = that.hide;
            if ( destroyit ) {
              fn = that.destroy;
            }
            var cntx = that;
            var timeout = that.settings.timeout;
            if( callback && typeof callback === "function" && context ) {
              fn = callback;
              cntx = context;
            }
            if ( timeout > 0 ) {
             window.setTimeout(function(){
               fn.call(cntx);
             }, timeout );
            }
            return true;
        });
      },
      /**
        * Hide the notice element.
        *
        * @class Notice
        * @function hide
        * @param {Boolean} destroyit If do you like remove wrapper element from DOM.
        * @param {Function} callback The callback function.
        * @param {Object} context Context of the callback fucntion. (callback.call(context)).
        */
      hide : function( destroyit, callback, context ) {
        this.settings.callhide();
        var that = this;
        destroyit = (typeof destroyit !== "boolean") ? false : destroyit;
        this.wrapper.fadeOut(1000, function() {
          $(this).css("opacity", "0" );
          if ( destroyit ) {
            that.destroyObject();
          }
          var cntx = that;
          if( callback && typeof callback === "function" && context ) {
            fn = callback;
            cntx = context;
          }
          return true;
        });
      }
    }
  });
  
  /**
    * Noticer is a Factory of Notice Class.
    *
    * @class jQuery.Noticer
    * @constructor
    * @param {jQuery Object} container
    * @param {String} content Content of the current Notice message (This must be Text).
    * @param {Object} [options] Options for the Notice (For more info see Notice Class).
    */
  $.extend({
    Noticer : function( maincontainer, options ) {
      this.notices = [];
      this.settings = $.extend( true, {}, $.Noticer.defaults, options );
      this.currentMainContainer = $( maincontainer );
      this.init();
    }
  });
    
  /////////////////////////////////////////////////////////////////////////////
  //
  // Defaults Noticer variables and Public Functions
  //
  /////////////////////////////////////////////////////////////////////////////
  $.extend($.Noticer, {
    defaults : {
      notices : []
    },
    setDefaults: function(settings) {
      $.extend( $.Noticer.defaults, settings );
    },
    prototype : {
      /**
        * Init the Noticer Factory
        *
        * @class jQuery.Noticer
        * @function init
        */
      init : function() {
        
      },
      /**
        * Init the Notice object
        *
        * @class jQuery.Noticer
        * @function createNotice
        * @param {String} content The content text of the notice.
        * @param {Object} [options] Options for the Notice (For more info see Notice Class).
        * @param {Boolean} destroyit If do you like remove wrapper element from DOM.
        */
      createNotice : function( content, options, destroyit ) {
        destroyit = (typeof destroyit !== "boolean") ? true : destroyit;
        
        var notice = new Notice( this.currentMainContainer, content, options );
        if ( content && typeof content === "string" && $.trim(content) !== "" ) {
          notice.show( destroyit );
        }
        this.notices.push( notice );
        return notice;
      }
    }
  });
})(jQuery);

/**
  * jQuery Ajax message plugin.
  *
  * @package    plugins
  * @see        http://www.huexotzinca.com/
  * @author     Neftali Bautista
  * @copyright  (c) 2011 Neftali Bautista
  * @license    http://lab.huexotzinca.com/license.html
  * @since      0.0.1
  */
(function($, undefined){
  var __settings = {
      "ele"       : $([]),          // selector name or jQuery object
      "text"      : "cargando...",  // default message
      "classname" : "loading-msg",  // classname of the Ajax Message Window
      "container" : null
  };
  var methods = {
        'on'        : function ( __msg ) {
          var settings = __settings,
              msg = __msg || settings.text;
          settings.container.text( msg )
                            .css( "display", "block" );
          return this;
        },
        'off'       : function () {
          var settings = __settings;
           settings.container.empty()
                             .css( "display", "none" );
          return this;
        },
        '__init'    : function () {
          var settings = __settings;
          if ( settings.container ) {
            return true;
          }
          settings.container = $(settings.ele);
          if ( !settings.container[0] ) {
            settings.container = null;
            $.error( "When init $.AXM the container element dosen't exist." );
            return false;
          }
          settings.container.removeClass(settings.classname)
                            .addClass(settings.classname)
                            .css( "display", "none" );
          return false;
        }
  };
  $.extend({
    AXM : function ( method, text ) {
      var settings = __settings;
      if (typeof method === 'object' && arguments.length === 1 ) {
        $.extend(settings, method);
        return this;
      } else if ( methods[method] && typeof text === 'object' ) {
        $.extend(settings, text);
        text = settings.text;
      }
      if ( this.constructor !== $.AXM.constructor ) {
        settings.ele = this;
      }
      methods.__init.call(this);
      if ( methods[method] ) {
        return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ) );
      } else if( typeof method === "string" && arguments.length === 1 ) {
        return methods.on.apply( this, arguments );
      } else {
        $.error( "Method " + method + " does not exist on $.AXM" );
      }
      return this;
    }
  });
  $.fn.extend({'AXM' : $.AXM});
})(jQuery);

/**
  * jQuery Alert message plugin.
  *
  * @package    plugins
  * @see        http://www.huexotzinca.com/
  * @author     Neftali Bautista
  * @copyright  (c) 2011 Neftali Bautista
  * @license    http://lab.huexotzinca.com/license.html
  * @since      0.0.1
  */
(function($){
  var __settings = {
      "ele"           : "#alert_msg",                         // selector name
      "default_msg"   : "",                                   // default message
      "classname"     : "alert-msg",                          // classname of the Ajax Message Window
      "classtoremove" : "info error success notice",           // classname needed remove
      "closemsg"      : "close",
      "container"     : null,
      "content"       : null,
      "button_close"  : null
  };
  var methods = {
        'on'        : function ( msg, cname, timeOut ) {
          var settings = __settings;
          var timeout = timeOut;
          if ( typeof timeOut !== 'number' || timeOut < 0 ) {
            timeOut = 0;
          }
          cname = cname || 'info';
          msg = msg || '';
          if ( methods.__init() ) {
           settings.content.text( msg );
           settings.container.removeClass( settings.classtoremove )
           .addClass( settings.classname + " " + cname )
           .slideDown("slow", function(){
             if (timeout > 0) {
               window.setTimeout( function () {
                 $.MSG( "off" );
               }, timeout * 1000);
             }           
           });
          }
        },
        'off'       : function () {
          var settings = __settings;
          if (methods.__init()) {
           settings.container.slideUp('slow', function () {
             $(this).removeClass( settings.classtoremove );
             settings.content.empty();
           });
          }
        },
        'error'     : function ( msg, timeOut ) {
          methods.on( msg, 'error', timeOut);
        },
        'notice'    : function ( msg, timeOut ) {
          methods.on( msg, 'notice', timeOut );            
        },
        'success'   : function ( msg, timeOut ) {
          methods.on( msg, 'success', timeOut );
        },
        'info'      : function ( msg, timeOut ) {
          methods.on( msg, 'info', timeOut );
        },
        '__init'    : function () {
          var settings = __settings;
          if ( settings.container ) {
            return true;
          }
          settings.container = $(  settings.ele );
          settings.content = $( "<div class='content'></div>" );
          settings.button_close = $( "<a href='#' class='closebtn' title='" + settings.closemsg + "'>x</a>" );
          settings.container = settings.container[0] ? settings.container : null;
          if ( !settings.container ) { return false; }
          settings.container.append( settings.content );
          settings.container.append( settings.button_close );
          settings.button_close.bind("click.h_msg.close", function(event){
            event.stopPropagation();
            $.MSG( "off" );
          });
          settings.container.addClass( settings.classname );
          return true;
        }
  };
  $.extend({
    MSG : function ( method, text, timeout ) {
      var settings = __settings;
      if ( methods[method] ) {
        return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ) );
      } else if( typeof method === 'object' || !method || ( typeof method === "string" && !text && !timeout ) ) {
        return methods.on.apply( this, arguments );
      } else if ( typeof method === "string" && typeof text === "number" && !timeout ) {
        return methods.on.call( this, method, "info", text );
      } else {
        $.error( "Method " + method + " does not exist on $.MSG" );
      }
      return this;
    }
  });
})(jQuery);
