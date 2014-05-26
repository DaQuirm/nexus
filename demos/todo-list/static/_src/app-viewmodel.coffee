TodosApp.ViewModels.AppViewModel = ->
  @Todos = new TodosApp.Models.TodoList()
  @TodosIdentity = new NGIdentityHash @Todos.Items, (todo) -> todo.Data.Value()['_id']
  #@Todos.Retrieve()

  @Create = (task) ->
    newTodo = @Todos.Create
      task: task,
      done: false,
      date: (new Date()).getTime()
    @Todos.Items.InsertBefore newTodo, @Todos.Items.First()

  @Select = (todoId) ->
    @SelectedTodo?.Selected.Value false
    todo = @TodosIdentity.Hash[todoId]
    todo.Selected.Value true
    @SelectedTodo = todo

  @ToggleTodoState = ->
    if @SelectedTodo?
      @SelectedTodo.Done.Value !currentTodo.Done.Value()
      @SelectedTodo.Selected.Value false
      @SelectedTodo = null

  @Delete = ->
    @SelectedTodo.State.OnValue NGAsyncStates.Deleted, ->
      @Todos.Remove @SelectedTodo
    @SelectedTodo.Delete()
    @SelectedTodo = null

  @DatepickerPosition = new NGProperty()
  @DatepickerPosition.Value { left: 0, top: 0 }

  @Datepicker = new Controls.Datepicker.ViewModels.ControlViewModel()

  @ShowDatepicker = (position) ->
    # unbind datepicker
    previousDate = @SelectedTodo.Date.Value()
    @Datepicker.CurrentDate.Value @SelectedTodo.Date.Value()
    @SelectedTodo.Date.Bind @Datepicker.SelectedDate, '<->', { TargetConverter: (date) =>
      @Datepicker.Visible.Value false
      date
    }
    @DatepickerPosition.Value position
    @Datepicker.Visible.Value true

  return undefined