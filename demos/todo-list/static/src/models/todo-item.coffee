class TodoItem extends nx.RestDocument
	constructor: (options) ->
		super
			url: '/todos/{_id}'

		@data.value = options?.data or {}

		@task = new nx.Property
		@data.bind @task, '<->', new nx.Mapping 'task':'_'

		@date = new nx.Property value:new Date
		@data.bind @date, '<->', new nx.Mapping 'date':'_'

		@done = new nx.Property
		@data.bind @done, '<->', new nx.Mapping 'done':'_'

		@selected = new nx.Property value:no

TodoList.models.TodoItem = TodoItem
