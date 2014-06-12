window.nxt = window.nxt || {};

nxt.ClassRenderer = function(element) {
	this.element = element;
};

nxt.ClassRenderer.prototype.render = function(classObj) {
	if (classObj.set) {
		this.element.classList.add(classObj.name);
	} else {
		this.element.classList.remove(classObj.name);
	}
};
