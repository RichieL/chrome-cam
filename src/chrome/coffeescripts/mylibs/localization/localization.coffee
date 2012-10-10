define [], ->
	pub = {}

	# TODO: is there any way to get all keys from chrome.i18n?
	keys = ["appName","appDesc","about_menu_item","clear_gallery_button","clear_gallery_dialog_title","clear_gallery_confirmation","filters_button","back_button","back_to_gallery_button","back_to_camera_button","save_button","delete_dialog_title","delete_confirmation","yes_button","no_button","ok_button","cancel_button","normal","andy","blockhead","blueberry","bulge","colorHalfTone","chubbyBunny","dent","flush","frogman","ghost","giraffe","inverted","kaleidoscope","mirrorLeft","oldFilm","photocopy","pinch","pixelate","quad","reflection","sepia","swirl","zoomBlur","about_credits","about_kendo","about_kendo_license","photo","paparazzi","gallery"]

	pub[key] = chrome.i18n.getMessage(key) for key in keys

	return pub