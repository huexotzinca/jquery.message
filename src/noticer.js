  /**
    * Notice Class. This creates a Notice Message in bottom left window (require default CSS class)
    *
    * @package Messages
    * @author  @JS_AUTHOR
    **/
  var Notice = function(maincontainer, options) {
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
  };
  
  $.extend(Notice, {
    default_options: {
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
      timeout: 4000
     },
     prototype: {
      /**
        * @method show
        * @param {Function|Number} callback The function that can apply after jQuery.fadeIn, pass 1 paramter current Notice Object. If callback is number that is the speed of the jQuery.fadeIn function and the next parameter $fn is blocked and deleted.
        * @param {Function} [$fn] jQuery function that supplies jQuery.fadeIn function
        **/
      show: function(callback, $fn) {
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
      },
      /**
        * See show method
        *
        * @method hide
        **/
      hide: function(callback, $fn) {
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
      },
      drop: function() {
        console.log("Droping this");
        this.$notice.remove();
        if (that.options.destroy != null) {
          that.destroy();
        }
        return this;
      },
      destroy: function() {
        this.$notice.remove();
        console.log("Destruyendo " + this.options.id);
        return this;
      },
      setContent: function(content) {
        this.content = content;
        this.$content.html(this.content);
        return this;
      },
      buildBackground: function() {
        var opt, opt_content, opt_wrapper;
        opt = this.options;
        opt_wrapper = opt.wrapper;
        opt_content = opt.content;
        this.$notice = $("<div id='" + opt.id + "' class='" + opt.classname + "'></div>");
        this.$wrapper = $("<div id='" + opt_wrapper.id + "' class='" + opt_wrapper.classname + "'></div>");
        this.$content = $("<div id='" + opt_content.id + "' class='" + opt_content.classname + "'></div>");
        this.$maincontainer.append(this.$notice.append(this.$wrapper.append(this.$content)));
        return this;
      }
     }
  });
  
  var Noticer = function(container, options, maincontainer) {
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
  };
  
  $.extend(Noticer, {
    default_options: {
      id: 'hux_messages_noticer',
      classname: 'noticer',
      force: true
    },
    prototype: {
      notice: function(content, options) {
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
      },
      createNotice: function(content, options, container) {
        return new Notice(content, options, container);
      }
    }
  });
