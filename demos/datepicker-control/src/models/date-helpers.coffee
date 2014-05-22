window.nxc.DatePicker.DateHelpers =

	MONTH_NAMES: [
		'January', 'February', 'March', 'April',
		'May', 'June', 'July', 'August', 'September',
		'October', 'November', 'December'
	]

	DAYS_OF_WEEK: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

	days_in_month: (date) ->
		new Date(do date.getFullYear, date.getMonth()+1, 0).getDate()

	get_week_day: (date) ->
    t = [0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4]
    year = do date.getFullYear
    month = date.getMonth() + 1
    day = do date.getDate
    year -= +(month < 3)
    (year + Math.floor(year/4) - Math.floor(year/100) + Math.floor(year/400) + t[month-1] + day) % 7

  week_lengths: (first_week_length, days) ->
    days_after_first_week = days - first_week_length
    [first_week_length].concat \
    	([1..Math.floor(days_after_first_week/7)].map -> 7),
    	if days_after_first_week % 7 isnt 0 then [days_after_first_week % 7] else []

  get_prev_month: (date) ->
    new Date do date.getFullYear, date.getMonth()-1, 1

  get_next_month: (date) ->
    new Date do date.getFullYear, date.getMonth()+1, 1

  first_month_day: (date) ->
    new Date do date.getFullYear, do date.getMonth, 1




