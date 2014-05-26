class TodoItem extends nx.RestDocument
	constructor: ->
		super
			url: '/todos/{_id}'

TodoList.models.TodoItem = TodoItem
