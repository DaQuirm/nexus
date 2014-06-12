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
	    nxt.Element 'input',
	      nxt.Attr('type','text'),
	      nxt.Attr('class','task-input'),
	      nxt.Attr('placeholder','Type a task here and press Enter')
	      # nxt.Event('keyup', (evt) ->
	      #   if evt.keyCode is 13
	      #     app.Create evt.target.value
	      # )
	  nxt.Element 'ul',
	    nxt.Attr('class','todo-list')
	    nxt.Collection(app.todos.items, ((item) -> TodoList.views.TodoItemView item),
	    	nxt.DelegatedEvent('click',
	    		'li': (event, item) ->
	    			alert 'item!'
	    			# app.Select target.parentNode.getAttribute('data-id')
	    		'a.status-link': (event, item) ->
	    			alert 'status!'
	    			# app.ToggleTodoState()
	    		'a.delete-link': (event, item) ->
	    			alert 'delete!'
	    			# app.Delete()
	    	)
	    )
	#   nxt.Element(
	#     'div',
	#     Attr('class','datepicker-layer'),
	#     Binding(app.DatepickerPosition, (position) -> Attr 'style', "left:#{position.left}px;top:#{position.top}px"),
	#     Template(Controls.Datepicker.Templates.Template, app.Datepicker)
	#   )
	# )
