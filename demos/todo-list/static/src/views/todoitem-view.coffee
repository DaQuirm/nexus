TodoList.views.TodoItemView = (item) ->
	nxt.Element 'li',
	  # nxt.Attr('data-id', item.Data.Value()['_id']),
	  # nxt.Binding(todoItem.Selected, (value) ->
	  #   Class 'selected',value
	  # ),
	  # nxt.Binding(todoItem.Done, (value)->
	  #   Class 'done',value
	  # ),
	  # nxt.Binding(todoItem.State, (value)->
	  #   Class 'updating',value is NGAsyncStates.Loading
	  # ),
	  nxt.Element('time',
	    nxt.Binding(item.date, (value) -> nxt.Text value.toDateString()))
	  nxt.Element('div',
	    nxt.Attr('class', 'task'),
	    nxt.Binding(item.selected, (value) ->
	      if value then nxt.Attr 'contenteditable','true'
	    ),
	    nxt.Binding(item.task, nxt.Text),
	    # Event('blur', (evt) ->
	    #   unless item.Task.Value() is evt.target.textContent
	    #     item.Task.Value evt.target.textContent
	    #     item.Save()
	    # )
	  ),
	  nxt.Element('a',
	    nxt.Attr('href','#'),
	    nxt.Attr('class','status-link'),
	    nxt.Binding(item.done, (done) ->
	      if done then nxt.Text 'Undone!' else nxt.Text 'Done!'
	    ),
	  ),
	  nxt.Element(
	    'a',
	    nxt.Attr('href','#'),
	    nxt.Attr('class','delete-link'),
	    nxt.Text('Delete')
	  )
	  nxt.Binding(item.status, (value) ->
	    if value is nx.AsyncStatus.LOADING
	      nxt.Element('div'
	        nxt.Attr('class', 'updating-cover'),
	        nxt.Text('Updating')
	      )
	  )

