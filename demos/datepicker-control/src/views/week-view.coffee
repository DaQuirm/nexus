window.nxc.DatePicker.views.WeekView = (weel, current_date) ->
	nxt.Element 'tr',
		if week.prev_month?
			[week.prev_month.start..week.prev_month.end].map \
				(day) ->
					nxt.Element 'td',
						nxt.Attr('class','datepicker-prev-month'),
						nxt.Text day
		if week.this_month?
			[week.this_month.start..week.this_month.end].map \
				(day) ->
					nxt.Element 'td',
						if day is do current_date.value.getDate
							nxt.Attr 'class','datepicker-today'
						nxt.Text day
		if week.next_month?
			[week.next_month.start..week.next_month.end].map \
				(day) ->
					nxt.Element 'td',
						nxt.Attr('class','datepicker-next-month'),
						nxt.Text day
