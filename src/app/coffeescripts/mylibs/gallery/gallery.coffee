define [
    'mylibs/utils/utils',
    'text!mylibs/gallery/views/gallery.html'
], (utils, templateSource) ->
    template = kendo.template(templateSource)

    loadImages = ->
        deferred = $.Deferred()

        token = $.subscribe "/pictures/bulk", (result) ->
            if result.message && result.message.length > 0
                $.publish "/bar/preview/update", [thumbnailURL: result.message[-1..][0].file]

            $.unsubscribe token
            dataSource = new kendo.data.DataSource
                data: result.message
                pageSize: 12
                change: ->
                    $.publish "/gallery/page", [ dataSource ]
            
            dataSource.read()

            deferred.resolve dataSource

        $.publish "/postman/deliver", [ {}, "/file/read", [] ]

        deferred.promise()

    createPage = (dataSource, $container) -> 
        # handle paging now!
        rowLength = 4
        rows = [
            dataSource.view()[0 * rowLength ... 1 * rowLength]
            dataSource.view()[1 * rowLength ... 2 * rowLength]
            dataSource.view()[2 * rowLength ... 3 * rowLength]
        ]

        $container.html template(rows: rows)

    setupSubscriptionEvents = ($container) ->

        kendo.fx.hide =
            setup: (element, options) ->
                $.extend { height: 25 }, options.properties

        $.subscribe "/gallery/show", (fileName) ->
            console.log fileName

        $.subscribe "/gallery/hide", ->
            $("#footer").animate "margin-top": "-60px"
            $("#wrap").kendoStop(true).css(height: "100%").kendoAnimate
                effects: "expand"
                show: true
                duration: 1000
                done: ->
                    $.publish "/camera/pause", [false]
                    $container.hide()

        $.subscribe "/gallery/list", ->
            $.publish "/camera/pause", [true]
            $container.show()
            $("#footer").animate "margin-top": 0
            $("#wrap").kendoStop(true).kendoAnimate
                effects: "expand"
                reverse: true
                hide: true
                duration: 1000

        $.subscribe "/gallery/page", (dataSource) ->
            createPage dataSource, $container

    pub =
        init: (selector) ->
            $container = $(selector)

            # after loading the images
            loadImages().done (dataSource) ->
                # set up the DOM events
                $container.on "click", ".thumbnail", ->
                    $.publish "/gallery/show", [$(this).data("file-name")]

                changePage = (direction) ->
                    # TODO: add transition effect...
                    if direction > 0 and dataSource.page() > 1
                        dataSource.page dataSource.page() - 1
                    if direction < 0 and dataSource.page() < dataSource.totalPages()
                        dataSource.page dataSource.page() + 1

                $container.kendoMobileSwipe (e) -> 
                    changePage (e.direction == "up") - (e.direction == "down")

                $.subscribe "/events/key/arrow", (e) ->
                    changePage (e == "down") - (e == "up")

                setupSubscriptionEvents $container
                
                # TODO: trigger refresh of items in list
                $.subscribe "/gallery/add", (file) ->
                    dataSource.add file

                $.publish "/gallery/page", [ dataSource ]