window.nx = window.nx || {};

nx.RestDocument = function(options) {
	nx.AjaxModel.call(this, options);
	this.options = options;
};

nx.RestDocument.prototype = Object.create(nx.AjaxModel.prototype);

nx.RestDocument.prototype.retrieve = function(done) {
	var _this = this;
	this.request({
		url: this.options.url,
		method: 'get',
		success: function(data) {
			_this.data.value = data;
			done.call(null, data);
		}
	});
};

nx.RestDocument.prototype.save = function(done) {
	var _this = this;
	this.request({
		url: this.options.url,
		data: this.data.value,
		method: 'put',
		success: function(data) {
			_this.data.value = data;
			done.call(null, data);
		}
	});
};

nx.RestDocument.prototype.remove = function(done) {
	var _this = this;
	this.request({
		url: this.options.url,
		method: 'delete',
		success: function(data) {
			done.call(null, data);
		}
	});
};
