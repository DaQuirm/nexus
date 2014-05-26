module.exports = function(grunt) {
	grunt.loadNpmTasks('grunt-coffee');
	grunt.loadNpmTasks('grunt-less');

	grunt.initConfig({
		concat: { 'static/todos-app.coffee': ['static/src/todos-app.coffee', 'static/src/!(todos-app).coffee'] },

		coffee: {
			app: {
				src: ['static/todos-app.coffee'],
				dest: 'static',
				options: {
					bare: true
				}
			},
			service: {
				src: ['service/service.coffee'],
				dest: '',
				options: {
					bare: true
				}
			}
    	},

    	less: {
    		app: {
    			src: ['static/style.less'],
    			dest: 'static/style.css'
    		}
    	},

    	min: {
    		app: {
    			src: ['static/todos-app.js'],
    			dest: 'static/todos-app.min.js'
    		}
    	}
	});

	grunt.registerTask('app', 'concat coffee:app');
	grunt.registerTask('service', 'coffee:service');
};