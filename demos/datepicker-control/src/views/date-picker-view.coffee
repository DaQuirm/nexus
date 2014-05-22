window.nxc.Datepicker.views.PickerView = (datepicker) ->
  WeekView = window.nxc.Datepicker.views.WeekView
  nxt.Element \
    'div',
    nxt.Attr('class','datepicker-control'),
    nxt.Binding(datepicker.visible, (visible) ->
      if not visible then nxt.Attr 'style', 'display:none' else nxt.Attr 'style',''),
    nxt.Element \
      'div',
      nxt.Attr('class','controls'),
    	nxt.Element \
        'button',
        nxt.Attr('class','year-prev-button'),
        nxt.Text('<<'),
        Event('click', datepicker.PrevYear),
      nxt.Element \
        'button',
        nxt.Attr('class','month-prev-button'),
        nxt.Text('<'),
        Event('click', datepicker.PrevMonth),
      nxt.Element \
        'span',
        nxt.Attr('class','datepicker-month'),
        nxt.Binding(datepicker.CurrentDate, (date) -> nxt.Text "#{datepicker.MonthNames[date.getMonth()]} #{date.getFullYear()}"),
      ),
      nxt.Element(
        'button',
        nxt.Attr('class','year-next-button'),
        nxt.Text('>>'),
        Event('click', datepicker.NextYear)
      )
      nxt.Element(
        'button',
        nxt.Attr('class','month-next-button'),
        nxt.Text('>'),
        Event('click', datepicker.NextMonth)
      ),
    ),
    nxt.Element(
    	'table',
    	nxt.Element(
    	  'tr',
    	  ForEach(
    	  	datepicker.DaysOfWeek,
    	  	(day) -> nxt.Element 'th', nxt.Text(day)
    	  )
    	),
      ForEach(
        datepicker.Weeks,
        (week) ->
          nxt.Element(
            'tr',
            if week.prevMonth?
              ForEach(
                [week.prevMonth.start..week.prevMonth.end],
                (day) -> nxt.Element(
                  'td',
                  nxt.Attr('class','datepicker-prev-month'),
                  nxt.Text(day)
                )
              )
            if week.thisMonth?
              ForEach(
                [week.thisMonth.start..week.thisMonth.end],
                (day) -> nxt.Element(
                  'td',
                  if day is datepicker.CurrentDate.Value().getDate()
                    nxt.Attr('class','datepicker-today')
                  nxt.Text(day)
                )
              )
            if week.nextMonth?
              ForEach(
                [week.nextMonth.start..week.nextMonth.end],
                (day) -> nxt.Element(
                  'td',
                  nxt.Attr('class','datepicker-next-month'),
                  nxt.Text(day)
                )
              )
          )
      ),
      Event('click', (evt) ->
        target = evt.target
        if target.nodeName.toLowerCase() is 'td'
          currentDate = datepicker.CurrentDate.Value()
          if target.classList.contains 'datepicker-prev-month'
            datepicker.PrevMonth()
          else if target.classList.contains 'datepicker-next-month'
            datepicker.NextMonth()
          else
            datepicker.SelectedDate.Value new Date(currentDate.getFullYear(), currentDate.getMonth(), target.nxt.textContent)
      )
    ),
    nxt.Element(
      'div',
      nxt.Attr('class','aux-controls'),
      nxt.Element(
        'button',
        nxt.Attr('class','today-pick-button'),
        nxt.Text('Today'),
        Event('click', (evt) -> datepicker.SelectedDate.Value new Date())
      )
    )
  )
