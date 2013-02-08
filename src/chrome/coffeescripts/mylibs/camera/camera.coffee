define [
    'libs/face/track'
    'mylibs/effects/effects'
    'mylibs/transfer/transfer'
], (face, effects, transfer) ->
    'use strict'

    canvas = document.getElementById("canvas")
    ctx = canvas.getContext("2d")
    track = { faces: [] }
    video = null
    paused = false

    wrapper = $(".wrapper")
    paparazzi = $(".paparazzi", wrapper)

    frame = 0

    supported = true

    effect = effects.data[0]

    draw = ->
        update()
        window.requestAnimationFrame draw

    update = ->
        # the camera is paused when it isn't being used to increase app performance
        return if paused

        ctx.drawImage video, canvas.width, 0, -canvas.width, canvas.height

        if effect.tracks and frame % 4 == 0
           track = face.track canvas

        # increment the curent frame counter. this is used for animated effects
        # like old movie and vhs. most effects simply ignore this
        frame++

        # pass in the webgl canvas, the canvas that contains the
        # video drawn from the application canvas and the current frame.
        effects.advance canvas
        effect.filter canvas, canvas, frame, track

    capture = (progress) ->
        flash()

        if progress.count > 1
            if progress.index == 0
                paparazzi.removeClass "hidden"
            # HACK: this should be refactored if time permits
            if progress.index == progress.count - 1
                setTimeout (->
                    wrapper.removeClass "paparazzi-1"
                    paparazzi.addClass "hidden"
                ), 1000

            wrapper.removeClass "paparazzi-" + (1 + progress.count - progress.index)
            wrapper.addClass "paparazzi-" + (progress.count - progress.index)

        image = canvas.toDataURL("image/jpeg", 1.0)
        name = new Date().getTime()

        # set the name of this image to the current time string
        file = { type: "jpg", name: "#{name}.jpg", file: image }

        $.publish "/file/save", [file]
        saveFinished = $.subscribe "/file/saved/#{file.name}", ->
            $.unsubscribe saveFinished
            $.publish "/postman/deliver", [ file, "/captured/image" ]

        animate file

    flash = ->
        div = $("#flash")
        fx = kendo.fx(div)
        anim = fx.fadeIn().play().done(-> fx.fadeOut().play())

    animate = (file) ->

        callback = ->
            $.publish "/postman/deliver", [ file, "/bottom/thumbnail" ]

        transfer.setup()
        transfer.add file
        transfer.run callback

    hollaback = (stream) ->
        window.stream = stream
        video = document.getElementById("video")
        video.src = window.URL.createObjectURL(stream)
        video.play()

        window.requestAnimationFrame draw

    errback = ->
        update = ->
            wrapper.hide()
            paused = true
            $.publish "/postman/deliver", [ {}, "/camera/unsupported" ]

    pause = (message) ->
        paused = message.paused
        wrapper.toggle (not paused)

        image = canvas.toDataURL("image/jpeg", 1.0)
        $.publish "/postman/deliver", [ image, "/camera/snapshot" ]

    pub =
        cleanup: ->
            video.pause()
            video.src = ""
            stream.stop()

        init: ->
            transfer.init()

            # start the camera
            navigator.webkitGetUserMedia { video: true }, hollaback, errback

            $.subscribe "/camera/capture", capture

            # subscribe to the pause event
            $.subscribe "/camera/pause", pause

            # TODO: Move this into effects
            $.subscribe "/effects/request", ->
                filters = ( id: e.id, name: e.name for e in effects.data )
                $.publish "/postman/deliver", [ filters, "/effects/response" ]

            $.subscribe "/camera/effect", (id) ->
                effect = e for e in effects.data when e.id is id

            # initialize the face tracking
            face.init 0, 0, 0, 0