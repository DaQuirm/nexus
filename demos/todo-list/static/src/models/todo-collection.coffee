class TodoCollection extends nx.RestCollection
	constructor: ->
		super
			url: '/todos'
			item: TodoList.models.TodoItem

TodoList.models.TodoCollection = TodoCollection
