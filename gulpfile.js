let gulp = require('gulp');
let yargs = require('yargs');
let sass = require('gulp-sass');
let minify = require('gulp-clean-css');
let gulpif = require('gulp-if');
let sourcemaps = require('gulp-sourcemaps');
let imagemin = require('gulp-imagemin');
let del = require('del');
let webpack = require('webpack-stream');

gulp.task('style', styleTask);
gulp.task('watch', watch);
gulp.task('images', images);
gulp.task('clean', clean);
gulp.task('build', build);
gulp.task('dev', dev);

const PRODUCTION = yargs.argv.prod;

const paths = {
	styles: {
		src: ['src/assets/scss/bundle.scss'],
		dest: 'dist/assets/css'
	},
	images: {
		src: 'src/assets/images/**/*.{jpg,jpeg,png,svg}',
		dest: 'dist/assets/images'
	}
}

function clean(){
	return del(['dist']);
}

function styleTask(){
	return gulp.src(paths.styles.src)
				.pipe(gulpif(!PRODUCTION, sourcemaps.init()))
				.pipe(sass().on('error', sass.logError))
				.pipe(gulpif(PRODUCTION, minify({compability: 'ie8'})))
				.pipe(gulpif(!PRODUCTION, sourcemaps.write()))
				.pipe(gulp.dest(paths.styles.dest));
}

function watch(){
	return gulp.watch('src/assets/**/*.scss', styleTask);
}

function images(){
	return gulp.src(paths.images.src)
				.pipe(gulpif(PRODUCTION, imagemin()))
				.pipe(gulp.dest(paths.images.dest));
}

function scripts(){
	return gulp.src()
}

function build(){
	return gulp.series(clean, gulp.parallel(styleTask, images))();
}

function dev(){
	return gulp.series(clean, gulp.parallel(styleTask, images), watch)();
}