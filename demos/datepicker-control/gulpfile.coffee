gulp   = require 'gulp'
gutil  = require 'gulp-util'
coffee = require 'gulp-coffee'
stylus = require 'gulp-stylus'
concat = require 'gulp-concat'

gulp.task 'datepicker-coffee', ->
	gulp.src ['./src/**/*.coffee', '!./src/app/**/*']
		.pipe(do coffee)
		.on 'error', gutil.log
		.pipe concat 'datepicker-control.js'
		.pipe gulp.dest './build/'
		return

gulp.task 'datepicker-stylus', ->
	gulp.src './stylesheets/*.styl'
		.pipe(do stylus)
		.on 'error', gutil.log
		.pipe concat 'datepicker-control.css'
		.pipe gulp.dest './build/'
		return

gulp.task 'app', ->
	gulp.src './src/app/*.coffee'
		.pipe(do coffee)
		.on 'error', gutil.log
		.pipe concat 'app.js'
		.pipe gulp.dest './build/'
		return

gulp.task 'default', [
	'datepicker-coffee',
	'datepicker-stylus',
	'app'
]
