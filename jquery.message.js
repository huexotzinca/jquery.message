(function() {
  /*!*
    * jQuery Message Classes and instance plugin.
    *
    * @package    plugins
    * @see        http://www.neftalibautista.com/
    * @author     Neftali Bautista
    * @copyright  (c) 2011 Neftali Bautista
    * @since      0.0.2
    
    Date: Wed Aug 24 23:25:14 2011 +0000
  */
  var $, Ajax, Message, Notice, Noticer, setTimeout;
  $ = jQuery;
  setTimeout = window.setTimeout;
  /**
    * Notice Class. This creates a Notice Message in bottom left window (require default CSS class)
    *
    * @package    Messages
    * @author     Neftali Bautista
    **/
  Notice = (function() {
    Notice.prototype.default_options = {
      id: 'hux_messages_notice',
      classname: 'notice',
      force: true,
      wrapper: {
        id: 'wrapper',
        classname: 'wrapper'
      },
      content: {
        id: 'content',
        classname: 'content'
      },
      speed: 2000,
      drop: false,
      destroy: false,
      timeout: 6000
    };
    function Notice(maincontainer, options) {
      var content, wrapper;
      this.maincontainer = maincontainer;
      if ((options.classname != null) && typeof options.classname === "string") {
        options.classname = "" + this.default_options.classname + " " + options.classname;
      } else {
        options.classname = this.default_options.classname;
      }
      this.options = $.extend({}, this.default_options, options);
      this.$maincontainer = $(this.maincontainer);
      wrapper = this.options.wrapper;
      content = this.options.content;
      wrapper.id = "" + this.options.id + "_" + wrapper.id;
      content.id = "" + wrapper.id + "_" + content.id;
      if (!this.$maincontainer.get(0) && this.options.force) {} else if (!this.$maincontainer.get(0)) {
        $.error("Notice Class: maincontainer (" + this.maincontainer + ") is undefined");
      }
      this.buildBackground();
      this.$notice.hide(0);
    }
    /**
      * @method show
      * @param {Function|Number} callback The function that can apply after jQuery.fadeIn, pass 1 paramter current Notice Object. If callback is number that is the speed of the jQuery.fadeIn function and the next parameter $fn is blocked and deleted.
      * @param {Function} [$fn] jQuery function that supplies jQuery.fadeIn function
      **/
    Notice.prototype.show = function(callback, $fn) {
      var self, vel;
      if (callback == null) {
        callback = (function() {
          return null;
        });
      }
      self = this;
      vel = this.options.speed;
      if (typeof callback === 'number' || typeof callback === 'string') {
        vel = callback;
        callback = function() {
          return null;
        };
      }
      if (typeof $fn === 'function') {
        $fn.call(this.$notice, this);
      } else {
        this.$notice.fadeIn(vel, function(eve) {
          var that;
          that = self;
          return setTimeout(function() {
            that = self;
            return that.hide();
          }, that.options.timeout);
        });
      }
      callback(this);
      return this;
    };
    /**
      * See show method
      *
      * @method hide
      **/
    Notice.prototype.hide = function(callback, $fn) {
      var self, vel;
      if (callback == null) {
        callback = (function() {
          return null;
        });
      }
      self = this;
      vel = this.options.speed;
      if (typeof callback === 'number' || typeof callback === 'string') {
        vel = callback;
        callback = function() {
          return null;
        };
      }
      if (typeof $fn === 'function') {
        $fn.call(this.$notice, this);
      } else {
        this.$notice.fadeOut(vel, function(eve) {
          var that;
          that = self;
          if (that.options.drop != null) {
            return that.drop();
          }
        });
      }
      callback(this);
      return this;
    };
    Notice.prototype.drop = function() {
      this.$notice.remove();
      if (this.options.destroy != null) {
        this.destroy();
      }
      return this;
    };
    Notice.prototype.destroy = function() {
      this.$notice.remove();
      return this;
    };
    Notice.prototype.setContent = function(content) {
      this.content = content;
      this.$content.html(this.content);
      return this;
    };
    Notice.prototype.buildBackground = function() {
      var opt, opt_content, opt_wrapper;
      opt = this.options;
      opt_wrapper = opt.wrapper;
      opt_content = opt.content;
      this.$notice = $("<div id='" + opt.id + "' class='" + opt.classname + "'></div>");
      this.$wrapper = $("<div id='" + opt_wrapper.id + "' class='" + opt_wrapper.classname + "'></div>");
      this.$content = $("<div id='" + opt_content.id + "' class='" + opt_content.classname + "'></div>");
      this.$maincontainer.append(this.$notice.append(this.$wrapper.append(this.$content)));
      return this;
    };
    return Notice;
  })();
  Noticer = (function() {
    Noticer.prototype.default_options = {
      id: 'hux_messages_noticer',
      classname: 'noticer',
      force: true
    };
    function Noticer(container, options, maincontainer) {
      this.container = container;
      this.maincontainer = maincontainer;
      this.notices = [];
      this.$container = $([]);
      this.options = $.extend({}, this.default_options, options);
      if (!$(this.container).get(0) && this.options.force) {
        this.container = $("<div id='" + this.options.id + "'></div>");
        $(this.maincontainer).append(this.container);
      } else if (!$(this.container).get(0)) {
        $.error("Noticer Class: container (" + this.container + ") is undefined");
      }
      this.$container = $(this.container);
      this.$container.addClass(this.options.classname);
    }
    Noticer.prototype.notice = function(content, options) {
      var notice, opts;
      if (content == null) {
        content = null;
      }
      if (arguments.length < 4) {
        opts = typeof options === 'object' ? $.extend({}, options) : {};
        opts.id = "" + this.options.id + "_" + (this.notices.length++);
        notice = this.createNotice(this.$container, opts);
        if (content && typeof content === "string" && $.trim(content) !== "") {
          notice.setContent(content);
          if ((typeof options === 'function' || (typeof options === 'string' || typeof options === 'number')) || (!options && arguments.length === 3)) {
            notice.show.apply(notice, Array.prototype.slice.call(arguments, 1));
          } else {
            notice.show();
          }
        }
      }
      this.notices.push(notice);
      return notice;
    };
    Noticer.prototype.createNotice = function(content, options, container) {
      return new Notice(content, options, container);
    };
    return Noticer;
  })();
  /**
    * Ajax Class. This creates a Ajax Message in top left window (require default CSS class)
    *
    * @package    Messages
    * @author     Neftali Bautista
    **/
  Ajax = (function() {
    Ajax.prototype.default_options = {
      id: 'hux_messages_ajax',
      classname: 'ajax',
      force: true,
      default_message: 'loading...'
    };
    function Ajax(container, options, maincontainer) {
      this.container = container;
      this.maincontainer = maincontainer;
      this.$container = $([]);
      this.options = $.extend({}, this.default_options, options);
      if (!$(this.container).get(0) && this.options.force) {
        this.container = $("<span id='" + this.options.id + "'></span>");
        $(this.maincontainer).append(this.container);
      } else if (!$(this.container).get(0)) {
        $.error("Message Class: container (" + this.container + ") is undefined");
      }
      this.$container = $(this.container);
      this.$container.attr('class', this.options.classname);
      this.off();
    }
    Ajax.prototype.on = function(message) {
      var msg;
      msg = message || this.options.default_message;
      this.$container.text(msg).css({
        display: 'block'
      });
      return this;
    };
    Ajax.prototype.off = function() {
      this.$container.empty().css({
        display: 'none'
      });
      return this;
    };
    Ajax.prototype.setOptions = function(options) {
      this.options = $.extend({}, this.options, options);
      return this;
    };
    return Ajax;
  })();
  /**
    * Message Class. This creates a Messages Factory this factory includes Noticer, Ajax, Modal, Alert and Prompt
    *
    * @package    Messages
    * @see        http://www.huexotzinca.com/
    * @author     Neftali Bautista
    * @license    http://lab.huexotzinca.com/license.html
    * @since      0.0.2
    **/
  Message = (function() {
    Message.prototype.default_options = {
      maincontainer: {
        id: 'hux_messages',
        classname: 'block-messages'
      },
      force: true
    };
    function Message(container, options) {
      this.container = container;
      this.$container = $([]);
      this.options = $.extend({}, this.default_options, options);
      if (!$(this.container).get(0) && this.options.force) {
        this.container = $("<div id='" + this.options.maincontainer.id + "'></div>");
        $('body').append(this.container);
      } else if (!$(this.container).get(0)) {
        $.error("Message Class: maincontainer (" + this.container + ") is undefined");
      }
      this.$container = $(this.container);
      this.options.maincontainer.id = this.$container.attr('id');
      this.$container.addClass(this.options.maincontainer.classname);
      this.ajax = new Ajax(null, this.options.ajax, this.$container);
      this.noticer = new Noticer(null, this.options.noticer, this.$container);
      this.Notice = function() {
        return this.noticer.notice.apply(this.noticer, arguments);
      };
      this.Ajax = function(msg) {
        if ((msg != null) && typeof msg === "string") {
          if (msg === "off") {
            return this.ajax.off();
          } else {
            return this.ajax.on(msg);
          }
        }
      };
    }
    Message.prototype.newNoticer = function(container, options, maincontainer) {
      return new Noticer(container, options, maincontainer);
    };
    Message.prototype.newAjax = function(container, options, maincontainer) {
      return new Ajax(container, options, maincontainer);
    };
    return Message;
  })();
  $.MSG = new Message();
  /**
    * jQuery Ajax plugin. See Ajax Class for details.
    *
    * @package    jQuery
    **/
  (function($) {
    var methods, settings;
    settings = {};
    methods = {
      on: function(context, arg) {
        context.on.apply(context, arg);
        return this;
      },
      off: function(context, arg) {
        context.off.apply(context, arg);
        return this;
      }
    };
    return $.fn.extend({
      ajax_msg: function(method, message, options) {
        var arg, opt, self;
        self = $.fn.ajax_msg;
        arg = arguments;
        opt = $.extend({}, settings, options);
        $(this).each(function(i, el) {
          var $el, __Ajax;
          $el = $(el);
          __Ajax = $el.data('ajax_msg');
          if (!__Ajax) {
            __Ajax = new Ajax($el, opt);
            $el.data('ajax_msg', __Ajax);
          }
          if (typeof method === 'object' && arg.length === 1) {
            opt = $.extend({}, method);
            __Ajax.setOptions(opt);
            return $el;
          }
          if (methods[method]) {
            return methods[method].call($el, __Ajax, Array.prototype.slice.call(arg, 1));
          } else if (typeof method === "string" && arg.length === 1) {
            return methods.on.call($el, __Ajax, arg);
          } else {
            return $.error("Method " + method + " does not exist on $.fn.ajax_msg");
          }
        });
        return this;
      }
    });
  })(jQuery);
}).call(this);
