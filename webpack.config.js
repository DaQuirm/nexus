var path = require('path');
var webpack = require('webpack');

module.exports = {

	context: __dirname,

	resolve: {
		root: [path.join(__dirname, 'lib')]
	},

	entry: {
		'nexus': './src/nexus.js',
		'nexus-test': './test/nexus-test.js'
	},

	output: {
		path: path.join(__dirname, 'dist'),
		filename: '[name].js'
	},

	devtool: 'source-map',

	plugins: [
		new webpack.ResolverPlugin(
			new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
		)
	],

	eslint: {
		configFile: './.eslintrc'
	},

	jscs: require('./jscs.json'),

	module: {
		loaders: [
			{ test: /\.js$/, loader: 'strict-loader!eslint-loader!jscs-loader', exclude: /lib/ }
		]
	}
};

