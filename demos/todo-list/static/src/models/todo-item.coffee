class TodoItem extends nx.RestDocument
	constructor: ({data}) ->
		super
			url: '/todos/{_id}'

		@data.value = data

		@task = new nx.Property
		@task.bind @data, '<-', new nx.Mapping 'task':'_'

		@date = new nx.Property value:new Date

		  # @Date = new NGProperty()
		  # @Data.Bind @Date, '<->',
		  # 	SourceMapping: { "date":"@" },
		  # 	SourceConverter: (milliseconds) -> new Date milliseconds
		  # 	TargetConverter: (date) -> date?.getTime()

		@done = new nx.Property
		@done.bind @data, '<-', new nx.Mapping 'done':'_'

		@selected = new nx.Property value:no

TodoList.models.TodoItem = TodoItem
