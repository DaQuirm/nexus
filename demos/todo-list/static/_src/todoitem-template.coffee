TodosApp.Templates.ItemTemplate = (todoItem) ->
  new NGTemplate(
  	Element(
  	  "li",
      Attr("data-id",todoItem.Data.Value()["_id"]),
      Binding(todoItem.Selected, (value)->
        Class "selected",value
      ),
      Binding(todoItem.Done, (value)->
        Class "done",value
      ),
      Binding(todoItem.State, (value)->
        Class "updating",value is NGAsyncStates.Loading
      ),
  	  Element(
  	  	"time",
  	  	Binding(todoItem.Date, (value) -> Text value.toDateString())
  	  ),
  	  Element(
  	  	"div",
  	  	Attr("class", "task"),
        Binding(todoItem.Selected, (value) ->
          if value then Attr "contentEditable","true" else Nothing()
        ),
  	  	Binding(todoItem.Task, (task)->Text task),
        Event("blur", (evt) ->
          unless todoItem.Task.Value() is evt.target.textContent
            todoItem.Task.Value evt.target.textContent
            todoItem.Save()
        )
  	  ),
  	  Element(
  	  	"a",
  	  	Attr("href","#"),
  	  	Attr("class","status-link"),
  	  	Binding(todoItem.Done, (done) ->
          if done then Text "Undone!" else Text "Done!"
        ),
  	  ),
  	  Element(
  	  	"a",
  	  	Attr("href","#"),
  	  	Attr("class","delete-link"),
  	  	Text("Delete")
  	  )
      Binding(todoItem.State, (value) ->
        if value is NGAsyncStates.Loading
          Element(
            "div"
            Attr("class", "updating-cover"),
            Text("Updating")
          )
        else
          Nothing()
      )
  	)
  )