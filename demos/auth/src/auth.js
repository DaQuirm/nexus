window.AuthApp = window.AuthApp || {};
AuthApp.Views = AuthApp.Views || {};

AuthApp.User = function(login) {
	this.login = new nx.Property({value: login});
	this.password = new nx.Property();

	// "fixture"
	this.accounts = {
		'elvis': '123'
	};

	this.status = new nx.Property({value: 'normal'}); // 'normal', 'success', 'error'
};

AuthApp.User.prototype.authenticate = function() {
	if (this.accounts[this.login.value] === this.password.value) {
		this.status.value = 'success';
	} else {
		this.status.value = 'error';
	}
};

AuthApp.Views.AuthForm = function(user) {
	return nxt.Element('div',
		nxt.Element('form',
			nxt.Element('label',
				nxt.Attr('for', 'login-input'),
				nxt.Text('Login')
			),
			nxt.Element('input',
				nxt.Attr('type', 'text'),
				nxt.Attr('id', 'login-input'),
				nxt.Binding(user.login, function(value) { return nxt.Text(value); }),
				nxt.Event('change', function() {
					user.login.value = this.value;
				})
			),
			nxt.Element('label',
				nxt.Attr('for', 'password-input'),
				nxt.Text('Password'),
				nxt.Event('change', function() {
					user.password.value = this.value;
				})
			),
			nxt.Element('input',
				nxt.Attr('type', 'password')
				nxt.Attr('id', 'password-input')
				nxt.Binding(user.password, function(value) { return nxt.Text(value); })
			),
			nxt.Element('input',
				nxt.Attr('type', 'submit')
				nxt.Attr('value', 'Authenticate')
				nxt.Event('submit', function(event) {
					event.preventDefault();
					user.authenticate();
				})
			)
		),
		nxt.Element('div',
			nxt.Binding(user.status, function(value) { return nxt.Text(value); })
		)
	);
};

document.addEventListener('load', function() {
	var user = new AuthApp.User('');
	document.body.appendChild(AuthApp.Views.AuthForm(user).element);
});