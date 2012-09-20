define [
    'Kendo'
    'text!mylibs/settings/views/settings.html' 
], (kendo, template) ->
    SETTINGS_VIEW = "#settings"

    view = null
    oldView = "#home"

    viewModel = kendo.observable
        show: ->
            $.publish "/postman/deliver", [ false, "/menu/enable" ]
            oldView = window.APP.app.view().id
            window.APP.app.navigate SETTINGS_VIEW
        hide: ->
            $.publish "/postman/deliver", [ true, "/menu/enable" ]
            window.APP.app.navigate oldView

    pub = 
        init: (selector) ->
            view = new kendo.View(selector, template)
            view.render(viewModel, true)

            $.subscribe '/menu/click/chrome-cam-settings-menu', ->
                viewModel.show()