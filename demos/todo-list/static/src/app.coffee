window.TodoList or= {}

TodoList =
	models: {}
	viewmodels: {}
	views: {}
	create: ->
		new @viewmodels.AppViewModel
