window.nx = window.nx || {};

nx.AsyncStatus = {
	LOADING: 1,
	DONE: 2,
	ERROR: 3
};

nx.AjaxModel = function(options) {
	options = options || {};

	this.data = new nx.Property();
	this.status = new nx.Property();

	if (typeof options.data !== 'undefined') {
		this.data.value = options.data;
	}
};

nx.AjaxModel.prototype.request = function(options) {
	var _this = this;
	var url = nx.Utils.interpolateString(options.url, options.data);
	this.xhr = new XMLHttpRequest();
	this.xhr.open(options.method, url, true);
	this.xhr.responseType = (!window.chrome) ? 'json' : 'text';

	this.xhr.onload = function (evt) {
		var handler;
		if (this.status === 200 || this.status === 201 || this.status === 204) {
			handler = options.success;
			_this.status.value = nx.AsyncStatus.DONE;
		} else {
			handler = options.error;
			_this.status.value = nx.AsyncStatus.ERROR;
		}
		if (typeof handler === 'function') {
			if (this.responseType === "json") {
				handler(this.response);
			} else if (this.responseText) {
				handler(JSON.parse(this.responseText));
			} else {
				handler();
			}
		}
	};

	if (options.method === 'post' || options.method === 'put') {
		this.xhr.setRequestHeader('Content-Type', 'application/json');
		this.xhr.send(JSON.stringify(options.data));
	} else {
		this.xhr.send();
	}
	_this.status.value = nx.AsyncStatus.LOADING;
};
