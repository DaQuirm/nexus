module.exports = function(grunt) {
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
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
		uglify: {
			build: {
				files: {
					'build/nexus.min.js': ['build/nexus.js']
				}
			}
		},
		jshint: {
			build: {
				files: {
					src: 'build/nexus.js'
				},
				options: {
					boss: true,
					browser: true,
					forin: false,
					strict: true,
					globals: {
						nx: true,
						nxt: true
					}
				}
			},
			test: {
				files: {
					src: 'test/**/*.js'
				},
				options: {
					browser: true,
					es5: true, // instanceof assertions
					strict: true,
					expr: true,
					globals: {
						chai: true,
						describe: true,
						it: true,
						should: true,
						nx: true,
						nxt: true
					}
				}
			}
		}
	});

	grunt.registerTask('default', ['concat:source', 'wrap:build', 'uglify:build', 'jshint:build']);
};
