TodoItem       = TodoList.models.TodoItem
TodoCollection = TodoList.models.TodoCollection

class AppViewModel

	constructor: ->
		@todos = new TodoCollection
		do @todos.retrieve

	render: (node) ->
		node.appendChild (TodoList.views.AppView @).node

TodoList.viewmodels.AppViewModel = AppViewModel
