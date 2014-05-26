TodosApp.Templates.AppTemplate = (app) ->

  Constants =
    DatepickerVerticalOffset: 30
    DatepickerWidth: 248

  document.body.addEventListener 'mousedown', -> app.Datepicker.Visible.Value false

  new NGTemplate(
    Element(
  	  "div",
  	  Attr("id","container"),
  	  Element("header",Text("ToDo")),
      Element("div",
        Binding(app.Todos.State, (state) ->
          if state is NGAsyncStates.Loading
            Attr "style","display:inline"
          else
            Attr "style","display:none"
        ),
        Attr("class","app-loading"),
        Text("Loading")
      ),
  	  Element(
  	  	"div",
  	  	Attr("id","add"),
  	  	Element(
  	  	  "input",
  	  	  Attr("type","text"),
  	  	  Attr("class","task-input"),
  	  	  Attr("placeholder","Type a task here and press Enter"),
          Event("keyup", (evt) ->
            if evt.keyCode is 13
              app.Create evt.target.value
          )
  	  	)
  	  )
  	  Element(
  	  	"ul",
  	  	Attr("class","todo-list")
  	  	ForEach(app.Todos.Items, (item) -> Template TodosApp.Templates.ItemTemplate, item),
        Event("click", (evt) ->
          target = evt.target
          if target.parentNode.nodeName.toLowerCase() is "li"
            if target.nodeName.toLowerCase() is "a" and target.classList.contains "status-link"
              app.ToggleTodoState()
            else if target.nodeName.toLowerCase() is "a" and target.classList.contains "delete-link"
              app.Delete()
            else
              app.Select target.parentNode.getAttribute('data-id')
              if target.nodeName.toLowerCase() is "time"
                clientRect = target.getBoundingClientRect()
                app.ShowDatepicker
                  top: target.offsetTop + target.offsetParent.offsetTop  + Constants.DatepickerVerticalOffset
                  left: target.offsetLeft + target.offsetParent.offsetLeft - (Constants.DatepickerWidth - clientRect.width)/2
            evt.preventDefault()
        )
  	  ),
      Element(
        "div",
        Attr("class","datepicker-layer"),
        Binding(app.DatepickerPosition, (position) -> Attr "style", "left:#{position.left}px;top:#{position.top}px"),
        Template(Controls.Datepicker.Templates.Template, app.Datepicker)
      )
    )
  )

