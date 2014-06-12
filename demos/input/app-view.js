function AppView(context) {
	return nxt.Element('main',
		Input(
			context,
			function (value) { return value*100; },
			function (value) { return value/100; },
			nxt.Attr({
				'type': 'range'
			})
		),
		nxt.Binding(context, function(value) {
			return nxt.Text((value*100).toFixed() + '%');
		})
	);
};
