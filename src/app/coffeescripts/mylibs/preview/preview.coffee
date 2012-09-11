define [
  'mylibs/effects/effects'
  'mylibs/utils/utils'
  'text!mylibs/preview/views/preview.html'
  'text!mylibs/preview/views/half.html'
  'text!mylibs/preview/views/page.html'
], (effects, utils, previewTemplate, halfTemplate, pageTemplate) ->
    
    ###     Select Preview

    Select preview shows pages of 6 live previews using webgl effects

    ###

    # object level vars

    paused = false
    canvas = {}
    ctx = {}
    previews = []
    frame = 0
    ds = {}
    flipping = false
    
    # define the animations. we slide different directions depending on if we are going forward or back.
    animation = 
        effects: "pageturn:horizontal"
        reverse: false
        duration: 800
        
    # the main draw loop which renders the live video effects      
    draw = ->

        $.subscribe "/camera/stream", (stream)->

            if not paused

                # get the 2d canvas context and draw the image
                # this happens at the curent framerate
                ctx.drawImage stream.canvas, 0, 0, canvas.width, canvas.height
                
                # for each of the preview objects, create a texture of the 
                # 2d canvas and then apply the webgl effect. these are live
                # previews
                for preview in previews

                    # increment the curent frame counter. this is used for animated effects
                    # like old movie and vhs. most effects simply ignore this
                    frame++
               
                    preview.filter preview.canvas, canvas, frame, stream.track

    keyboard = (enabled) ->

        # if we have enabled keyboard navigation
        if enabled

            # subscribe to the left arrow key
            $.subscribe "/events/key/arrow", (e) ->

                if not flipping
                    page e

        # otherwise
        else

            # unsubscribe from events
            $.unsubcribe "/events/key/arrow"

    page = (direction) ->

        # if the direction requested was left
        if direction == "left"

            animation.reverse = false

            # if the current page is less than the total 
            # number of pages
            if ds.page() < ds.totalPages()

                # go to the next page
                ds.page ds.page() + 1

        # otherwise
        else

            animation.reverse = true

            # if this isn't page one
            if ds.page() > 1

                # go to the previous page
                ds.page(ds.page() - 1)


    # anything under here is public
    pub = 
        
        # the show function that is called by the view on show
        show: ->
            $.publish "/bottom/update", [ "preview" ]

        # makes the internal draw function publicly accessible
        draw: ->
            draw()

        swipe: (e) ->

            # page in the direction of the swipe
            page e.direction
            
        init: (selector) ->
        
            # initialize effects
            # TODO: this should be initialized somewhere else
            effects.init()

            # bind to keyboard events
            keyboard true

            # subscribe to the pause and unpause events
            $.subscribe "/previews/pause", (isPaused) ->
                paused = isPaused 

            # create an internal canvas that contains a copy of the video. this
            # is so we can resize the video stream without resizing the original canvas
            # which contains our unadulturated stream
            canvas = document.createElement("canvas")
            ctx = canvas.getContext("2d")

            # set the width and height of the previews
            canvas.width = 360 
            canvas.height = 240

            # in order to page through previews, we need to create two pages. the current
            # page and the next page.
            page1 = new kendo.View(selector, pageTemplate)
            page2 = new kendo.View(selector, pageTemplate)

            previousPage = page1.render()
            nextPage = page2.render()

            # create a new kendo data source
            ds = new kendo.data.DataSource
                    
                # set the data equal to the array of effects from the effects
                # object
                data: effects.data
                
                # we want it in chunks of six
                pageSize: 6
                
                # when the data source changes, this event will fire
                change: ->

                    flipping = true

                    # pause. we are changing pages so stop drawing.
                    #   paused = true

                    # create an array of previews for the current page
                    previews = []

                    for item in @.view()

                        # this is wrapped in a closure so that it doesn't step on itself during
                        # the async loop
                        do ->

                            filter = document.createElement "canvas"
                            filter.width = canvas.width
                            filter.height =canvas.height

                            data = { effect: item.id, name: item.name }

                            filters = new kendo.View(nextPage, previewTemplate, data)
                            html = filters.render()
                            html.find(".canvas").append(filter).click ->

                                paused = true

                                $.publish "/full/show", [ item ]

                            # nextPage.append $(preview).find("a").append(filter).end()

                            # half.append $(preview).find("a").append(thing).end()

                            previews.push { canvas: filter, filter: item.filter }

                            

                    # move the current page out and the next page in
                    page1.container.kendoAnimate {
                        effects: animation.effects
                        face: if animation.reverse then nextPage else previousPage
                        back: if animation.reverse then previousPage else nextPage
                        duration: animation.duration
                        reverse: animation.reverse
                        complete: ->
                            # the current page becomes the next page
                            justPaged = previousPage
                            
                            previousPage = nextPage
                            nextPage = justPaged

                            justPaged.empty()

                            flipping = false
                    }


            # read from the datasource
            ds.read()    
    

