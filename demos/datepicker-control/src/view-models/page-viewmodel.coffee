window.DatePickerApp or= {}

class AppViewModel
	constructor: ->
		@datepicker = do nxc.DatePicker.create

	render: (node) ->
		node.appendChild (DatePickerApp.PageView @).node

DatePickerApp.AppViewModel = AppViewModel





