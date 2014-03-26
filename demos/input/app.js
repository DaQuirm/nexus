window.addEventListener('load', function() {
	var number = new nx.Property({ value: 0.25 });
	document.body.appendChild(AppView(number).node);
});
