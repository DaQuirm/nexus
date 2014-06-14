TodoList.views.AppView = (app) ->

	nxt.Element 'div',
		nxt.Attr('id','container'),
		nxt.Element('header', nxt.Text 'ToDo'),
		nxt.Element 'div',
			nxt.Binding(app.todos.status, (status) ->
				if status is nx.AsyncStatus.LOADING
					nxt.Attr 'style','display:inline'
				else
					nxt.Attr 'style','display:none'
			),
			nxt.Attr('class','app-loading'),
			nxt.Text('Loading')

		nxt.Element 'div',
			nxt.Attr('id','add'),
			nxt.Input(app.todos.new_item.task,
				((value) -> value or ''),
				((value) -> value),
				nxt.Attr(
					'type': 'text'
					'class': 'task-input'
					'placeholder': 'Type a task here and press Enter'
				),
				nxt.Event('keyup', (event) ->
					if event.keyCode is 13
						do app.todos.create
				)
			)

		nxt.Element 'ul',
			nxt.Attr('class','todo-list')
			nxt.Collection(app.todos.items, ((item) -> TodoList.views.TodoItemView item),
				nxt.DelegatedEvent('click',
					'li': (event, item) ->
						app.todos.select item
					'a.status-link': (event, item) ->
						item.done.value = not item.done.value
						do item.save
					'a.delete-link': (event, item) ->
						item.remove ->
							app.todos.items.remove item
				),
				nxt.DelegatedEvent('blur',
					'li': (event, item) ->
						do item.save
				)
			)
		#   nxt.Element(
		#	'div',
		#     Attr('class','datepicker-layer'),
		#     Binding(app.DatepickerPosition, (position) -> Attr 'style', "left:#{position.left}px;top:#{position.top}px"),
		#     Template(Controls.Datepicker.Templates.Template, app.Datepicker)
		#   )
		# )


nxt.Input = (property, converter, backConverter, content...) ->
	inputElement = nxt.Element('input',
		content...,
		nxt.Binding(property, (value) ->
			nxt.Attr 'value', converter value
		),
		nxt.Event('input', ->
			property.value = backConverter inputElement.node.value
		)
	)
	inputElement
