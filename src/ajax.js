  /**
    * Ajax Class. This creates a Ajax Message in top left window (require default CSS class)
    *
    * @package Messages
    * @author  @JS_AUTHOR
    **/
  var Ajax = function(container, options, maincontainer) {
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
  };
  
  $.extend(Ajax, {
    default_options: {
      id: 'hux_messages_ajax',
      classname: 'ajax',
      force: true,
      default_message: 'loading...'
    },
    prototype : {
      on : function(message) {
        var msg;
        msg = message || this.options.default_message;
        this.$container.text(msg).css({
          display: 'block'
        });
        return this;
      },
      off : function() {
        this.$container.empty().css({
          display: 'none'
        });
        return this;
      },
      setOptions : function(options) {
        this.options = $.extend({}, this.options, options);
        return this;
      }
    }
  });
