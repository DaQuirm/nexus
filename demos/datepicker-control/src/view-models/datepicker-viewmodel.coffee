class PickerModel extends nxc.DatePicker.models.Model

	constructor: ->
		@helpers = DateHelpers = nxc.DatePicker.DateHelpers
		@current_date = new nx.Property value:new Date

		@weeks = new nx.Collection
		@weeks.bind @current_date, (date) ->
			days_in_current_month = DateHelpers.days_in_month date
			days_in_prev_month = DateHelpers.days_in_month DateHelpers.get_prev_month(date)
			first_month_day = DateHelpers.first_month_day date
			first_week_length = 7 - DateHelpers.get_week_day first_day
			week_lengths = DateHelpers.week_lengths first_week_length, days_in_current_month
			weeks = week_lengths
				.reduce ((acc, length) ->
					[[start, end]] = if acc.length > 0 then acc else [[0,0]]
					[[end+1, end+length]].concat acc), []
				.reverse()
				.map ([start, end], index, weeks) ->
					if end - start + 1 < 7
						if index is 0
							this_month:
								start: start
								end: end
							prev_month:
								start: days_in_prev_month - (7 - end) + 1
								end: days_in_prev_month
						else if index is weeks.length - 1
							this_month:
								start: start
								end: end
							next_month:
								start: 1
								end: 7 - (end - start + 1)
					else
						this_month:
							start: start
							end: end

			if weeks.length < 6
				if weeks[0].this_month.end - weeks[0].this_month.start + 1 is 7
					weeks.unshift
						prev_month:
							start: days_in_prev_month - 7 + 1
							end: days_in_prev_month

			if weeks.length < 6
					start = if weeks[weeks.length-1].next_month
						weeks[weeks.length-1].next_month.end + 1
					else
						1
					weeks.push
						next_month:
							start: start
							end: start + 6
			weeks

		@prev_month = =>
			@current_date.value = DateHelpers.get_prev_month @current_date.value

		@next_month = =>
			@current_date.value = DateHelpers.get_next_month @current_date.value

		@prev_year = =>
			date = @current_date.value
			@current_date.value = new Date date.getFullYear()-1, do date.getMonth, do date.getDate

		@next_year = =>
			date = @current_date.value
			@current_date.value = new Date date.getFullYear()+1, do date.getMonth, do date.getDate

		@visible = new nx.Property value:no

window.nxc.DatePicker.viewmodels.PickerModel = PickerModel


