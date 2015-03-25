module.exports = function(grunt) {
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-wrap');

	grunt.initConfig({

		paths: {
			src_files:              [
										'src/core/utils.js',
										'src/**/*!(utils).js'
									],
			test_files:            'test/**/*.js',
			build_file:            'build/nexus.js',
			build_file_compressed: 'build/nexus.min.js',
			build_dev_file:        'build/nexus.dev.js'
		},

		concat: {
			source: {
				src: '<%= paths.src_files %>',
				dest: '<%= paths.build_file %>'
			},
			source_dev: {
				src: '<%= paths.src_files %>',
				dest: '<%= paths.build_dev_file %>'
			}
		},
		wrap: {
			build: {
				src: '<%= paths.build_file %>',
				dest: '',
				options: {
					wrapper: ['(function() {\n\t\'use strict\';\n', '\n})();\n']
				}
			},
			build_dev: {
				src: '<%= paths.build_dev_file %>',
				dest: '',
				options: {
					wrapper: ['(function() {\n\t\'use strict\';\n', '\n})();\n']
				}
			}
		},
		uglify: {
			build: {
				files: {
					'<%= paths.build_file_compressed %>': ['<%= paths.build_file %>']
				}
			}
		},
		jshint: {
			build: {
				files: {
					src: '<%= paths.build_file %>'
				},
				options: {
					boss: true,
					browser: true,
					forin: false,
					strict: true,
					laxbreak: true,
					globals: {
						nx: true,
						nxt: true
					}
				}
			},
			build_dev: {
				files: {
					src: '<%= paths.build_dev_file %>'
				},
				options: {
					boss: true,
					browser: true,
					forin: false,
					strict: true,
					laxbreak: true,
					globals: {
						nx: true,
						nxt: true
					}
				}
			},
			test: {
				files: {
					src: '<%= paths.test_files %>'
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
		},
		watch: {
			scripts: {
				files: ['<%= paths.src_files %>'],
				tasks: ['concat:source_dev', 'wrap:build_dev', 'jshint:build_dev'],
				options: {
				  spawn: false,
				},
			},
		}
	});

	grunt.registerTask('default', ['concat:source', 'wrap:build', 'uglify:build', 'jshint:build']);
};
