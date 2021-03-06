define [], ->
    kendo.data.binders.localeText = kendo.data.Binder.extend
        refresh: ->
            text = APP.localization[@bindings.localeText.path]
            unless text?
                console.log "Missing localization for " + @bindings.localeText.path + ", is it in localization.coffee?"
            $(@element).text text

    kendo.data.binders.localeHtml = kendo.data.Binder.extend
        refresh: ->
            html = APP.localization[@bindings.localeHtml.path]
            unless html?
                console.log "Missing localization for " + @bindings.localeHtml.path + ", is it in localization.coffee?"
            $(@element).html html

    kendo.data.binders.localeTitle = kendo.data.Binder.extend
        refresh: ->
            title = APP.localization[@bindings.localeTitle.path]
            unless title?
                console.log "Missing localization for " + @bindings.localeTitle.path + ", is it in localization.coffee?"
            $(@element).attr "title", title