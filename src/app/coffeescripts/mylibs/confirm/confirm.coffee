define [
    'Kendo'
], (kendo) ->

    view = {}
    callback = null
    open = false

    close = (result) ->
        view.data("kendoMobileModalView").close()

        $.publish "/tabbing/restore", [ $(document.body) ]
        $(document.body).focus()

        open = false
        if callback
            callback result

    pub =
        yes: (e) -> close true

        no: (e) -> close false

        init: (selector) ->

            # view = new kendo.View(selector, template)
            # view.render(viewModel, true)
            view = $(selector)

            $.subscribe "/confirm/show", (title, message, cb) ->
                callback = cb

                view.find(".title").html(title)
                view.find(".message").html(message)

                view.find(".yes").text window.APP.localization.yesButton
                view.find(".no").text window.APP.localization.noButton

                view.data("kendoMobileModalView").open()

                # HACK: This should probably be done in a better way.
                $.publish "/tabbing/remove", [ $(document.body) ]
                $.publish "/tabbing/restore", [ view ]

                setTimeout (->
                    view.find(".yes").focus()
                ), 250

                open = true

            esc = ->
                if open
                    pub.no()
                    return false

            $.subscribe "/keyboard/esc", esc, true

