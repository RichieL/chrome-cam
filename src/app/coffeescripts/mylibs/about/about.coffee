define [
  'Kendo' 	
  'text!mylibs/about/views/about.html'
], (kendo, template) ->
	
	previous = "#home"

	CONFIRM_TEXT = "You are about to delete all media from your gallery. You will not be able to get these items back. Are you sure you want to do this?"

	viewModel = kendo.observable

		back: ->
			$.publish "/postman/deliver", [ true, "/menu/enable" ]
			window.APP.app.navigate previous

		goto: (e) ->
			$.publish "/postman/deliver", [$(e.currentTarget).attr("href"), "/tab/open"]

		gallery:
			clear: ->
				$.publish "/confirm/show", [ "Remove All", CONFIRM_TEXT, -> $.publish("/gallery/clear") ]

	pub = 

		# unlike the viewModel events, these events are for the mobile view itself
		before: ->
			$.publish "/postman/deliver", [{ paused: true }, "/camera/pause"]

		hide: ->
			$.publish "/postman/deliver", [{ paused: false }, "/camera/pause"]

		init: (selector) ->

			# create the about view
			view = new kendo.View(selector, template)
			view.render(viewModel, true)

			# subscribe to the about event from the context menu
			$.subscribe '/menu/click/chrome-cam-about-menu', ->
				$.publish "/postman/deliver", [ false, "/menu/enable" ]
				previous = window.APP.app.view().id
				window.APP.app.navigate selector

