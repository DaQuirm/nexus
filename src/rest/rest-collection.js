window.nx = window.nx || {};

nx.RestCollection = function(options) {
	nx.AjaxModel.call(this, options);
	nx.Collection.call(this, options);
	this.options = options;

	var _this = this;
	this.data.bind(
		this,
		'<->',
		function (items) {
			return items.map(function (item) {
				new _this.options.item({ data: item, url: _this.options.url });
			});
		},
		function (items) {
			items.map(function (item) { return item.data.value; });
		}
	);
};

nx.RestCollection.prototype = Object.create(nx.AjaxModel.prototype);
nx.RestCollection.prototype.constructor = nx.RestCollection;

nx.RestCollection.prototype.request = function(options) {
	nx.AjaxModel.prototype.request.call(this, {
		url: this.options.url,
		method: options.method,
		success: options.success
	});
};

nx.RestCollection.prototype.create = function(doc, done) {
	nx.RestDocument.prototype.request.call(doc, {
		url: this.options.url,
		method: 'post',
		success: done
	});
};

nx.RestCollection.prototype.retrieve = function(done) {
	this.request({ method: 'get', success: done });
};
