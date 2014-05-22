window.nxc.DatePicker.views.PickerView = (datepicker) ->
  WeekView = window.nxc.Datepicker.views.WeekView
  nxt.Element 'div',
    nxt.Attr('class','datepicker-control'),

    nxt.Binding datepicker.visible, (visible) ->
      if not visible
        nxt.Attr 'style', 'display:none'
      else nxt.Attr 'style', ''

    nxt.Element 'div',
      nxt.Attr('class','controls'),
      nxt.Element 'button',
        nxt.Attr('class','year-prev-button'),
        nxt.Text('<<'),
        nxt.Event('click', datepicker.prev_year)
      nxt.Element 'button'
        nxt.Attr('class','month-prev-button'),
        nxt.Text('<'),
        nxt.Event('click', datepicker.prev_month)
      nxt.Element 'span',
        nxt.Attr('class','datepicker-month'),
        nxt.Binding datepicker.current_date, (date) ->
          nxt.Text "#{datepicker.MonthNames[date.getMonth()]} #{date.getFullYear()}"
      nxt.Element 'button',
        nxt.Attr('class','year-next-button'),
        nxt.Text('>>'),
        nxt.Event('click', datepicker.next_year)
      nxt.Element 'button',
        nxt.Attr('class','month-next-button'),
        nxt.Text('>'),
        nxt.Event('click', datepicker.next_month)

    nxt.Element 'table',
      nxt.Element('tr',
        datepicker.helpers.days_of_week.map (day) ->
          nxt.Element 'th', nxt.Text day),

      datepicker.weeks.map(WeekView.bind null, datepicker.current_date),

      nxt.Event 'click', (evt) ->
        target = evt.target
        if target.nodeName.toLowerCase() is 'td'
          current_date = datepicker.current_date.value
          if target.classList.contains 'datepicker-prev-month'
            do datepicker.prev_month
          else if target.classList.contains 'datepicker-next-month'
            do datepicker.next_month
          else
            datepicker.selected_date.value = new Date \
              do current_date.getFullYear,
              do current_date.getMonth,
              target.textContent

    nxt.Element 'div',
      nxt.Attr('class','aux-controls'),
      nxt.Element 'button',
        nxt.Attr('class','today-pick-button'),
        nxt.Text('Today'),
        nxt.Event('click', (evt) -> datepicker.selected_date.value = new Date)
