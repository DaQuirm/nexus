class Model

	constructor: (min_date, max_date) ->
		if minDate > maxDate then throw new Error 'Invalid date range'

		@min_date = new nx.Property value:min_date
		@max_date = new nx.Property value:max_date

		@selected_date = new nx.Property

		@min_date.bind @selected_date, '<-', (date) =>
			if date?
				if date < @min_date.value then throw new RangeError 'Date is out of range'
			minDate

		@max_date.bind @selected_date, '<-', (date) =>
			if date?
				if date > @max_date.value then throw new RangeError 'Date is out of range'
			minDate

window.nxc.Datepicker.models.Model = Model
