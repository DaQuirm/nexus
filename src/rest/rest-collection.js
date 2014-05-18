window.nx = window.nx || {};

nx.RestCollection = function(options) {
	nx.AjaxModel.call(this, options);
	this.options = options;
	this.items = new nx.Collection();
};

nx.RestCollection.prototype = Object.create(nx.AjaxModel.prototype);

nx.RestCollection.prototype.create = function(doc, done) {
	this.request({
		url: this.options.url,
		method: 'post',
		data: doc.data.value,
		success: function(response) {
			doc.data.value = response;
			done.call(null, response);
		}
	});
};

nx.RestCollection.prototype.retrieve = function(done) {
	var _this = this;
	var docUrl = this.options.url + this.options.itemUrl;
	this.request({
		url: this.options.url,
		method: 'get',
		success: function(items) {
			_this.items.set(items.map(function(item) {
				var doc = new _this.options.item({ data: item, url: docUrl });
				return doc;
			}));
			done.call(null, _this.items);
		}
	});
};
