function Input(property, converter, backConverter, attrs) {
	var inputElement = nxt.Element('input',
		attrs,
		nxt.Binding(property, function(value) {
			return nxt.Attr('value', converter(value));
		}),
		nxt.Event('input', function() {
			property.value = backConverter(inputElement.node.value);
		})
	);
	return inputElement;
}
