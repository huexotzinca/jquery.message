###!*
  * jQuery Message Classes and instance plugin.
  *
  * @package    plugins
  * @see        http://www.neftalibautista.com/
  * @author     Neftali Bautista
  * @copyright  (c) 2011 Neftali Bautista
  * @since      0.0.2
  
  Date: Mon Sep  5 12:05:12 CDT 2011
###
$ = jQuery
setTimeout = window.setTimeout

###*
  * Notice Class. This creates a Notice Message in bottom left window (require default CSS class)
  *
  * @package    Messages
  * @author     Neftali Bautista
  *###
class Notice
  default_options:
    id: 'hux_messages_notice',
    classname: 'notice',
    force: true,
    wrapper:
            id: 'wrapper',
            classname: 'wrapper'
    content:
            id: 'content',
            classname: 'content'
    speed  : 2000,     #animation speed
    drop   : false,
    destroy: false,
    timeout: 6000

  constructor: (@maincontainer, options) ->
    if options.classname? and typeof options.classname == "string"
      options.classname = "#{ @default_options.classname } #{ options.classname }"
    else
      options.classname = @default_options.classname
    @options = $.extend {}, @default_options, options
    @$maincontainer = $ @maincontainer
    wrapper = @options.wrapper
    content = @options.content
    wrapper.id = "#{ @options.id }_#{ wrapper.id }"
    content.id = "#{ wrapper.id }_#{ content.id }"
    if !@$maincontainer.get(0) and @options.force
      #$(@maincontainer).append @container
    else if !@$maincontainer.get(0)
      $.error "Notice Class: maincontainer (#{ @maincontainer }) is undefined"
    # creating a background
    @buildBackground()
    @$notice.hide 0

  ###*
    * @method show
    * @param {Function|Number} callback The function that can apply after jQuery.fadeIn, pass 1 paramter current Notice Object. If callback is number that is the speed of the jQuery.fadeIn function and the next parameter $fn is blocked and deleted.
    * @param {Function} [$fn] jQuery function that supplies jQuery.fadeIn function
    *###
  show: (callback = (() -> null), $fn ) ->
    self = @
    vel = @options.speed
    if (typeof callback is 'number' or typeof callback is 'string')
      vel = callback
      callback = () -> null
    if typeof $fn is 'function'
      $fn.call @$notice, @
    else
      @$notice.fadeIn vel, (eve) ->
        that =  self
        setTimeout( () ->
          that = self
          that.hide()
        , that.options.timeout)
    callback(@)
    @

  ###*
    * See show method
    *
    * @method hide
    *###
  hide: (callback = (() -> null), $fn) ->
    self = @
    vel = @options.speed
    if (typeof callback is 'number' or typeof callback is 'string')
      vel = callback
      callback = () -> null
    if typeof $fn is 'function'
      $fn.call @$notice, @
    else
      @$notice.fadeOut vel , (eve) ->
        that = self
        if that.options.drop?
          that.drop()
    callback(@)
    @

  drop: () ->
    #console.log "Droping this #{ @options.id }"
    @$notice.remove()
    if @options.destroy?
      @destroy()
    @

  destroy: () ->
    @$notice.remove()
    #console.log "Destruyendo #{ @options.id }"
    @
  
  setContent: (@content) ->
    @$content.html @content
    @

  buildBackground: ->
    opt = @options
    opt_wrapper = opt.wrapper
    opt_content = opt.content
    @$notice = $("<div id='#{ opt.id }' class='#{ opt.classname }'></div>")
    @$wrapper = $("<div id='#{ opt_wrapper.id }' class='#{ opt_wrapper.classname }'></div>")
    @$content = $("<div id='#{ opt_content.id }' class='#{ opt_content.classname }'></div>")
    @$maincontainer.append @$notice.append @$wrapper.append @$content
    #@$maincontainer.append @$notice.append @$content
    @

class Noticer
  default_options:
    id: 'hux_messages_noticer',
    classname: 'noticer',
    force: true
  constructor: (@container, options, @maincontainer) ->
    # Init the values and objects
    @notices = []
    @$container = $([])
    @options = $.extend {}, @default_options, options
    # Cheack if the container exist otherwise and if you Force then container must be created
    # and added to the end of the document
    if !$(@container).get(0) and @options.force
      @container = $("<div id='#{ @options.id }'></div>")
      $(@maincontainer).append(@container)
    else if !$(@container).get(0)
      $.error "Noticer Class: container (#{ @container }) is undefined"
    @$container = $ @container
    @$container.addClass @options.classname
  notice: (content = null, options ) ->
    if arguments.length < 4
      opts = if typeof options is 'object' then $.extend {}, options else {}
      opts.id = "#{ @options.id }_#{ @notices.length++ }"
      notice = @createNotice @$container, opts
      if content and typeof content is "string" and $.trim(content) != ""
        notice.setContent(content)
        if (typeof options is 'function' or (typeof options is 'string' or typeof options is 'number')) or (!options and arguments.length is 3)
          notice.show.apply notice, Array.prototype.slice.call arguments, 1
        else
          notice.show()
    @notices.push notice
    notice

  createNotice: (content, options, container) ->
    new Notice(content, options, container)

###*
  * Ajax Class. This creates a Ajax Message in top left window (require default CSS class)
  *
  * @package    Messages
  * @author     Neftali Bautista
  *###
class Ajax
  default_options:
    id: 'hux_messages_ajax',
    classname: 'ajax',
    force: true,
    default_message: 'loading...'

  constructor: (@container, options, @maincontainer) ->
    # Init the values and objects
    @$container = $([])
    @options = $.extend {}, @default_options, options
    # Cheack if the container exist otherwise and if you Force then container must be created
    # and added to the end of the document
    if !$(@container).get(0) and @options.force
      @container = $("<span id='#{ @options.id }'></span>")
      $(@maincontainer).append(@container)
    else if !$(@container).get(0)
      $.error "Message Class: container (#{ @container }) is undefined"
    @$container = $ @container
    @$container.attr 'class', @options.classname
    @off()
  on: (message)->
    msg = message || @options.default_message
    @$container.text(msg)
               .css display: 'block'
    @

  off: ->
    @$container.empty()
               .css display: 'none'
    @
  setOptions: (options) ->
    @options = $.extend {}, @options, options
    @

###*
  * Message Class. This creates a Messages Factory this factory includes Noticer, Ajax, Modal, Alert and Prompt
  *
  * @package    Messages
  * @see        http://www.huexotzinca.com/
  * @author     Neftali Bautista
  * @license    http://lab.huexotzinca.com/license.html
  * @since      0.0.2
  *###
class Message
  default_options:
    maincontainer:
                    id: 'hux_messages',
                    classname: 'block-messages',
    force: true

  constructor: (@container, options) ->
    # Init the values and objects
    @$container = $([])
    @options = $.extend {}, @default_options, options
    # Cheack if the container exist otherwise and if you Force then container must be created
    # and added to the end of the document
    if !$(@container).get(0) and @options.force
      @container = $("<div id='#{ @options.maincontainer.id }'></div>")
      $('body').append(@container)
    else if !$(@container).get(0)
      $.error "Message Class: maincontainer (#{ @container }) is undefined" #shows jQuery error message
    #init jQuery container
    @$container = $ @container
    @options.maincontainer.id = @$container.attr('id')
    @$container.addClass @options.maincontainer.classname

    # Creating and init the Objects for all messages types
    # and added to corresponding public scope variable
    @ajax = new Ajax null, @options.ajax, @$container
    @noticer = new Noticer null, @options.noticer, @$container
    @Notice = ()->
      @noticer.notice.apply(@noticer, arguments)
    @Ajax = (msg) ->
      if msg? and typeof msg == "string"
        if msg == "off"
          @ajax.off()
        else
          @ajax.on(msg)

  newNoticer: (container, options, maincontainer) ->
    new Noticer(container, options, maincontainer)

  newAjax: (container, options, maincontainer) ->
    new Ajax(container, options, maincontainer)
  

$.MSG = new Message()

###*
  * jQuery Ajax plugin. See Ajax Class for details.
  *
  * @package    jQuery
  *###
(($) ->
 settings = {}
 methods =
   on: (context, arg) ->
     context.on.apply context, arg
     @

   off: (context, arg) ->
     context.off.apply context, arg
     @

 $.fn.extend
  ajax_msg: (method, message, options) ->
    self = $.fn.ajax_msg
    arg = arguments
    opt = $.extend {}, settings, options
    $(@).each (i, el) ->
      $el = $(el)
      __Ajax = $el.data('ajax_msg')
      if !__Ajax
        __Ajax = new Ajax($el, opt)
        $el.data('ajax_msg', __Ajax)
      if typeof method is 'object' and arg.length is 1
        opt = $.extend {}, method
        __Ajax.setOptions opt
        return $el
      if methods[method]
        return methods[method].call $el, __Ajax, Array.prototype.slice.call arg, 1
      else if typeof method is "string" and arg.length is 1
        return methods.on.call $el, __Ajax, arg
      else
        $.error "Method #{ method } does not exist on $.fn.ajax_msg"
    @
)(jQuery)

