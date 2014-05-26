TodosApp.Models.Todo = (json) ->
  NGRestDocument.call @, url: "/todos/{_id}"
  NGContinuousModel.call @

  @Data.Value json if json?

  @Task = new NGProperty()
  @Data.Bind @Task, '<->', SourceMapping: { "task":"@" }

  @Date = new NGProperty()
  @Data.Bind @Date, '<->',
  	SourceMapping: { "date":"@" },
  	SourceConverter: (milliseconds) -> new Date milliseconds
  	TargetConverter: (date) -> date?.getTime()

  @Done = new NGProperty()
  @Data.Bind @Done, '<->', SourceMapping: { "done":"@" }

  @Selected = new NGProperty()
  @Selected.Value false

  undefined