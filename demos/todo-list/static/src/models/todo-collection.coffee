TodoItem = TodoList.models.TodoItem

class TodoCollection extends nx.RestCollection
	constructor: ->
		@selected_item = new nx.Property value:null
		@new_item = new TodoItem
		super
			url: '/todos'
			item: TodoItem

	select: (item) ->
		@selected_item.value?.selected.value = no
		@selected_item.value = item
		item.selected.value = yes

	create: ->
		super @new_item, (item) =>
			first = @todos.items[0]
			@todos.insertBefore first, item

TodoList.models.TodoCollection = TodoCollection
