TodoItem = TodoList.models.TodoItem

class TodoCollection extends nx.RestCollection
	constructor: ->
		@selected_item = new nx.Property value:null
		super
			url: '/todos'
			item: TodoItem

	select: (item) ->
		@selected_item.value item
		item.selected.value = yes

TodoList.models.TodoCollection = TodoCollection
