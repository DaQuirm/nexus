window.nx = window.nx || {};

nx.RestCollection = function(options) {
	nx.Collection.call(this, options);
	nx.AjaxModel.call(this, options);
	this.options = options;

	var _this = this;
	this.bind(
		this.data,
		'<->',
		function (items) {
			return items.map(function (item) { return item.data.value; });
		},
		function (items) {
			return items.map(function (item) {
				return new _this.options.item({ data: item, url: _this.options.url });
			});
		}
	);
};

nx.Utils.mixin(nx.RestCollection.prototype, nx.Collection.prototype);
nx.Utils.mixin(nx.RestCollection.prototype, nx.AjaxModel.prototype);

nx.RestCollection.prototype.request = function(options) {
	var _this = this;
	nx.AjaxModel.prototype.request.call(this, {
		url: this.options.url,
		method: options.method,
		success: function () { options.success(_this.items); }
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
