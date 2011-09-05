  /**
    * Notice Modal. This creates a Notice Message in bottom left window (require default CSS class)
    *
    * @package    Messages
    * @author     Neftali Bautista
    **/
  var Modal = function(container, options, maincontainer) {
    this.container = container;
    this.maincontainer = maincontainer;
    this.options = $.extend({}, this.default_options, options);
    if (!$(this.container).get(0) && this.options.force) {
      this.container = $("<div id='" + this.options.id + "_container'></div>");
      $(this.maincontainer).append(this.container);
    } else if (!$(this.container).get(0)) {
      $.error("Modal Class: container (" + this.container + ") is undefined");
    }
    this.buildBackground();
    this.$modal.hide(0);
  };
  
  $.extend(Modal, {
    default_options: {
      id: 'hux_modal',
      classname: 'modal',
      buttonclose: false,
      force: false,
      default_title: 'Alert!',
      wrapper: {
        id: 'wrapper',
        classname: 'wrapper'
      },
      title: {
        id: 'title',
        classname: 'title'
      },
      content: {
        id: 'content',
        classname: 'content'
      },
      control: {
        id: 'control',
        classname: 'control'
      },
      close: {
        id: 'close',
        classname: 'close'
      },
      button: {
        id: 'button',
        classname: 'button ligth-green',
        options: {
          action: "click",
          fn: function() {
            return alert("aqui mero");
          },
          classname: "button"
        }
      }
    },
    prototype: {
      buildBackground: function() {
        this.$modal = $("<div id='" + this.options.id + "' class='" + this.options.classname + "'></div>");
        this.$wrapper = $("<div id='" + this.options.wrapper.id + "_wrapper' class='" + this.options.wrapper.classname + "'></div>");
        this.$title = $("<div id='" + this.options.title.id + "_title' class='" + this.options.title.classname + "'></div>");
        this.$content = $("<div id='" + this.options.content.id + "_content' class='" + this.options.content.classname + "'></div>");
        this.$controls = $("<div id='" + this.options.control.id + "_controls' class='" + this.options.control.classname + "'></div>");
        this.container.append(this.$modal.append(this.$wrapper.append(this.$title, this.$content, this.$controls)));
        if (this.options.buttonclose != null) {
          this.$close = $("<span id='" + this.options.close.id + "' class='" + this.options.close.classname + "'>X</span>");
          this.$close.bind("click." + this.options.id, function() {
            console.log("here in close button");
            return console.log("what's up?");
          });
          this.$modal.append(this.$close);
        }
        return this;
      },
      addButton: function(value, options) {
        var btn, button, self;
        if (value == null) {
          value = "button";
        }
        self = this;
        btn = this.options.button;
        options = $.extend({}, btn.options, options);
        button = $("<input type='button' class='" + btn.classname + "' value='" + value + "'/>");
        button.bind("" + options.action + "." + this.options.id, function() {
          return options.fn.call(self);
        });
        this.$controls.append(button);
        return this;
      },
      dropButton: function() {
        return this;
      },
      setTitle: function(title) {
        if (title == null) {
          title = this.options.default_title;
        }
        this.$title.html(title);
        return this;
      },
      setContent: function(content) {
        this.$content.html(content);
        return this;
      },
      show: function(content, title) {
        this.setContent(content);
        this.setTitle(title);
        this.$modal.fadeIn(2000);
        return this;
      },
      hide: function() {
        this.$modal.fadeOut(2000);
        return this;
      },
      close: function() {
        return this.hide();
      },
      drop: function() {
        return this.hide();
      }
    }
  });
