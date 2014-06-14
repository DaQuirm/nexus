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
		@new_item.date.value = do (new Date).getTime
		@new_item.done.value = false
		super @new_item, (item) =>
			first = @items.items[0]
			@items.insertBefore first, new TodoItem data:item

TodoList.models.TodoCollection = TodoCollection
