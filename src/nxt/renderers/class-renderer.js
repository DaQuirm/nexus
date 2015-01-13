nxt.ClassRenderer = {

	add: function (data, domContext) {
		domContext.container.classList.add(data.name);
	},

	remove: function (data, domContext) {
		domContext.container.classList.remove(data.name);
	}

};
