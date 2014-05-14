window.nx = window.nx || {};

nx.RestCollection = function(options) {
	this.url = options.url;
	this.itemConstructor = options.item;
	this.items = new nx.Collection();
};

nx.RestCollection.prototype = Object.create(nx.AjaxModel.prototype);

nx.RestCollection.prototype.create = function(item, done) {
	var _this = this;
	this.request({
		url: this.url,
		method: 'post',
		data: item.data.value,
		success: function(data) {
			_this.data.value = data;
			done.call(null, data);
		}
	});
};

nx.RestCollection.prototype.retrieve = function(done) {
	var _this = this;
	this.request({
		url: this.url,
		method: 'get',
		success: function(data) {
			_this.data.value = data;
			done.call(null, data);
		}
	});
};
