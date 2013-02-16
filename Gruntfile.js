module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.initConfig({
    jshint: {
        all: ['Gruntfile.js', 'lib/**/*.js', 'test/**/*.js']
    }
  });

  grunt.registerTask('default', ['jshint:all']);
};