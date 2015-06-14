var path = require('path');
var webpack = require('webpack');

module.exports = {

	context: __dirname,

	resolve: {
		root: [path.join(__dirname, 'lib')]
	},

	entry: {
		'nexus': './src/nexus.js',
		'nexus-node': './src/nexus-node.js',
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

	module: {
		loaders: [
			{ test: /\.js$/, loader: 'strict-loader!eslint-loader', exclude: /lib/ }
		]
	}
};

