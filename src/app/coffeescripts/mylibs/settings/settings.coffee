define [
    'Kendo'
    'mylibs/file/filewrapper'
    'mylibs/config/config'
    'text!mylibs/settings/views/settings.html' 
], (kendo, filewrapper, config, template) ->
    SETTINGS_VIEW = "#settings"

    view = null
    previous = "#home"
    CONFIRM_TEXT = "You are about to delete all media from your gallery. You will not be able to get these items back. Are you sure you want to do this?"

    viewModel = kendo.observable
        
        flash:
            enabled: false
            change: (e) ->
                config.set "flash", viewModel.flash.enabled
        
        show: ->
            $.publish "/postman/deliver", [ false, "/menu/enable" ]
            previous = window.APP.app.view().id
            window.APP.app.navigate SETTINGS_VIEW
        
        hide: ->
            $.publish "/postman/deliver", [ true, "/menu/enable" ]
            window.APP.app.navigate previous
        
        gallery:
            clear: ->
                $.publish "/confirm/show", [ CONFIRM_TEXT, "/gallery/clear" ]

    pub = 

        # unlike the viewModel events, these events are for the mobile view itself
        before: ->
            $.publish "/postman/deliver", [{ paused: true }, "/camera/pause"]

        hide: ->
            $.publish "/postman/deliver", [{ paused: false }, "/camera/pause"]

        init: (selector) ->
            view = new kendo.View(selector, template)
            view.render(viewModel, true)

            config.get "flash", (value) ->
                viewModel.flash.enabled = value

            $.subscribe '/menu/click/chrome-cam-settings-menu', ->
                viewModel.show()