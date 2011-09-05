  /**
    * Messages Class. This creates a Messages Factory this factory includes Noticer, Ajax, Modal, Alert and Prompt
    *
    * @package Messages
    * @author  @JS_AUTHOR
    **/
  var Message = function(container, options) {
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
    this.alert = new Alert(null, this.options.alert, this.$container);
    this.prompt = new Prompt(null, this.options.alert, this.$container);
  };
  
  $.extend(Message, {
    default_options: {
      maincontainer: {
        id: 'hux_messages',
        classname: 'block-messages'
      },
      force: true
    },
    prototype: {
      newNoticer: function(container, options, maincontainer) {
        return new Noticer(container, options, maincontainer);
      },
      newAjax: function(container, options, maincontainer) {
        return new Ajax(container, options, maincontainer);
      },
      newModal: function(container, options, maincontainer) {
        return new Modal(container, options, maincontainer);
      },
      newAlert: function(container, options, maincontainer) {
        return new Alert(container, options, maincontainer);
      },
      newPrompt: function(container, options, maincontainer) {
        return new Prompt(container, options, maincontainer);
      }
    }
  });
