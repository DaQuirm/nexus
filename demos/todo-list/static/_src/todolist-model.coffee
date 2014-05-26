TodosApp.Models.TodoList = ->
	NGRestCollection.call @, { url: "/todos", itemModel: TodosApp.Models.Todo }
