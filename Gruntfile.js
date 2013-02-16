module.exports = function(grunt) {
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-wrap');

	grunt.initConfig({
		concat: {
			source: {
				src: 'src/**/*.js',
				dest: 'build/nexus.js'
			}
		},
		wrap: {
			build: {
				src: 'build/nexus.js',
				dest: '',
				wrapper: ['(function() {\n\t\'use strict\';\n', '\n})();\n']
			}
		},
		jshint: {
			build: ['build/nexus.js'],
			source: ['src/**/*.js'],
			test: ['test/**/*.js'],
			options: {
				boss: true,
				browser: true,
				forin: false,
				strict: true,
				globals: {
					'nx': true
				},
			}
		}
	});

	grunt.registerTask('default', ['concat:source', 'wrap:build', 'jshint:build']);
};
