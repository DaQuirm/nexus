window.nx = window.nx || {};

nx.RestCollection = function(options) {
	nx.AjaxModel.call(this, options);
	this.options = options;
	this.items = new nx.Collection();
};

nx.RestCollection.prototype = Object.create(nx.AjaxModel.prototype);
nx.RestCollection.prototype.constructor = nx.RestCollection;

nx.RestCollection.prototype.create = function(doc, done) {
	this.request({
		url: this.options.url,
		method: 'post',
		data: doc.data.value,
		success: function(response) {
			doc.data.value = response;
			if (typeof done === 'function') {
				done.call(null, response);
			}
		}
	});
};

nx.RestCollection.prototype.retrieve = function(done) {
	var _this = this;
	this.request({
		url: this.options.url,
		method: 'get',
		success: function(items) {
			_this.items.set(items.map(function(item) {
				var doc = new _this.options.item({ data: item, url: _this.options.url });
				return doc;
			}));
			if (typeof done === 'function') {
				done.call(null, _this.items);
			}
		}
	});
};
