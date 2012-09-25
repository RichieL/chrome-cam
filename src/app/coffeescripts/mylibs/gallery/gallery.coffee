define [
    'Kendo'
    'mylibs/utils/utils'
    'mylibs/file/filewrapper'
    'text!mylibs/gallery/views/thumb.html'
], (kendo, utils, filewrapper, template) ->
    
    pageSize = 12
    files = []
    ds = {}
    data = []
    container = {}
    el = {}
    selected = {} 
    total = 0
    index = 0
    flipping = false
    pages = 
        previous: {}
        next: {}
    active = {}

    animation = 
        effects: "pageturn:horizontal"
        reverse: false
        duration: 800      

    select = (name) =>

        # find the item with the specified name
        selected = container.find("[data-name='#{name}']").parent(":first")
        container.find(".thumbnail").removeClass "selected"
        selected.addClass "selected"

    page = (direction) =>

        return if flipping
        
        if direction > 0 and @ds.page() > 1
            flipping = true
            animation.reverse = true
            @ds.page @ds.page() - 1
            render(true)
        if direction < 0 and @ds.page() < @ds.totalPages()
            flipping = true
            animation.reverse = false
            @ds.page @ds.page() + 1
            render(true)

    destroy = ->

        name = selected.children(":first").attr("data-name")
        
        selected.kendoStop(true).kendoAnimate
            effects: "zoomOut fadOut"
            hide: true
            complete: =>
                filewrapper.deleteFile(name).done => 
                    $.publish "/top/update", ["deselected"]
                    selected.remove()
                    @ds.remove(@ds.get(name))
                    render()


    get = (name) => 
        # find the match in the data source
        match = @ds.get(name)
        # now get its index in the current view
        index = @ds.view().indexOf(match)
        # the actual index of this item in relation to the whole set
        # of data is the page number times. it's zero based so we have to do
        # some funky calculations
        position = if @ds.page() > 1 then pageSize * (@ds.page() - 1) + index else index 
        return { length: @ds.data().length, index: position, item: match }

        select name

    at = (index) =>
        # we may need to page the data before grabbing the item.
        # to get the current page, divide the index by the pageSize. then
        target = Math.ceil((index + 1) / pageSize)
        # go ahead and go to that page if needed
        if (target != @ds.page()) 
            @ds.page(target)
            render()
        # the actual index of the item within the page has to be recalculated if
        # the current page is greater than 1
        position = if target > 1 then index - pageSize else index
        # now we can search the current datasource view for the item at the correct index
        match = { length: @ds.data().length, index: index, item: @ds.view()[position] }
        $.publish "/details/update", [match]
        
        select match.item.name

    dataSource =
        create: (data) =>
            @ds = new kendo.data.DataSource
                data: data
                pageSize: 12                    
                sort:
                    dir: "desc" 
                    field: "name"  
                schema: 
                    model:
                        id: "name" 

    add = (item) =>
        item = { name: item.name, file: item.file, type: item.type }
        # check to make sure there is a data source before trying to add to it
        if not @ds
            @ds = dataSource.create([item])
        else
            # add the item to the datasource
            @ds.add(item)

    create = (item) ->

        element = {}
        fadeIn = (e) ->
            $(e).kendoAnimate {
                effects: "fadeIn",
                show: true
            }

        if item.type == "webm"
            element = document.createElement "video"
            element.setAttribute("controls", "")
            element.loadeddata = fadeIn(element)
        else 
            element = new Image()
            element.onload = fadeIn(element)
        
        element.src = item.file
        element.setAttribute("data-name", item.name)
        element.setAttribute("draggable", true)

        element.width = 270
        element.height = 180
        
        element.setAttribute("class", "hidden")

        return element

    render = (flip) =>

        thumbs = []

        for item in @ds.view()
            thumbnail = new kendo.View(pages.next, "<div class='thumbnail'></div>")
            thumbs.push(dom: thumbnail.render(), data: item)

        complete = =>

            setTimeout(->
                for item in thumbs

                    do ->
                        element = create(item.data)
                        item.dom.append(element)
            , 50)

            # the current page becomes the next page
            pages.next.show()

            justPaged = pages.previous
            justPaged.hide()
            justPaged.empty()

            pages.previous = pages.next
            pages.next = justPaged

            flipping = false

        if flip

            # move the current page out and the next page in
            container.kendoAnimate {
                effects: animation.effects
                face: if animation.reverse then pages.next else pages.previous
                back: if animation.reverse then pages.previous else pages.next
                duration: animation.duration
                reverse: animation.reverse
                complete: complete
            }

        else complete()

    pub =

        before: (e) ->

            # container.parent().height($(window).height() - 50)
            # container.parent().width($(window).width())

            # pause the camera. there is no need for it
            # right now.
            $.publish "/postman/deliver", [{ paused: true }, "/camera/pause"]

            # listen to keyboard events
            $.subscribe "/keyboard/arrow", (e) ->
                if not flipping
                    page (e == "right") - (e == "left")

        hide: (e) ->
            # unpause the camera
            $.publish "/postman/deliver", [{ paused: false }, "/camera/pause"]

            # don't respond to the keyboard events anymore
            $.unsubscribe "/keyboard/arrow"

            pages.next.empty()
            pages.previous.empty()

        show: (e) =>
            setTimeout(->
                render()
            , 420)
        
        swipe: (e) ->    
            page (e.direction == "right") - (e.direction == "left")

        init: (selector) =>

            # create the pages that hold the thumbnails
            # in order to page through previews, we need to create two pages. the current
            # page and the next page.
            page1 = new kendo.View(selector, null)
            page2 = new kendo.View(selector, null)

            # get a reference to the view container
            container = page1.container

            pages.previous = page1.render().addClass("page gallery")
            active = pages.next = page2.render().addClass("page gallery")

            #delegate some events to the gallery
            page1.container.on "dblclick", ".thumbnail", ->
                thumb = $(@).children(":first")            
                $.publish "/details/show", [ get("#{thumb.data("name")}") ]

            page1.container.on "click", ".thumbnail", ->
                thumb = $(@).children(":first")            
                $.publish "/top/update", ["selected"]
                $.publish "/item/selected", [get("#{thumb.data("name")}")]
                select thumb.data("name")

            $.subscribe "/pictures/bulk", (message) =>
                @ds = dataSource.create(message.message)
                @ds.read()
                if @ds.view().length > 0
                    $.publish "/bottom/thumbnail", [@ds.view()[0]]

            $.subscribe "/gallery/delete", ->
                destroy()

            $.subscribe "/gallery/add", (item) ->
                add(item)

            $.subscribe "/gallery/at", (index) ->
                at(index)

            $.subscribe "/gallery/clear", =>
                window.APP.app.showLoading()
                filewrapper.clear().done =>
                    @ds.read()
                    window.APP.app.hideLoading()

            $.publish "/postman/deliver", [ {}, "/file/read" ]

            return gallery
