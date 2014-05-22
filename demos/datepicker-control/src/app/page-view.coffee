window.DatePickerApp or= {}

DatePickerApp.PageView = (page) ->
	nxt.Element 'div',
		nxt.Element 'div',
			nxt.Attr('class', 'date'),
			nxt.Binding page.datepicker.selected_date, (value) ->
				if value
					page.datepicker.visible.value = no
					nxt.Text do value.toLocaleDateString
			nxt.Event 'click', (evt) ->
				page.datepicker.visible.value = !page.datepicker.visible.value

		nxc.DatePicker.views.PickerView page.datepicker
