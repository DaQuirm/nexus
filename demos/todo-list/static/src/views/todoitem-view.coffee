TodoList.views.TodoItemView = (item) ->
	nxt.Element 'li',
	  nxt.Binding(item.selected, (selected) ->
	    nxt.Class 'selected', selected
	  ),
	  nxt.Binding(item.done, (done) ->
	    nxt.Class 'done', done
	  ),
	  nxt.Binding(item.status, (updating) ->
	    nxt.Class 'updating', updating is nx.AsyncStatus.LOADING
	  ),
	  nxt.Element('time',
	    nxt.Binding(item.date, (date) -> nxt.Text date.toDateString()))
	  nxt.Element('div',
	    nxt.Attr('class', 'task'),
	    nxt.Binding(item.selected, (selected) ->
	      if selected then nxt.Attr 'contenteditable','true'
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
	  nxt.Element('a',
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

