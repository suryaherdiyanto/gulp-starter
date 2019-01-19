let gulp = require('gulp');
let yargs = require('yargs');
let sass = require('gulp-sass');
let minify = require('gulp-clean-css');
let gulpif = require('gulp-if');
let sourcemaps = require('gulp-sourcemaps');
let imagemin = require('gulp-imagemin');
let del = require('del');
let webpack = require('webpack-stream');
let uglify = require('gulp-uglify');

gulp.task('style', styleTask);
gulp.task('watch', watch);
gulp.task('images', images);
gulp.task('clean', clean);
gulp.task('build', build);
gulp.task('dev', dev);
gulp.task('scripts', scripts);

const PRODUCTION = yargs.argv.prod;

const paths = {
	styles: {
		src: ['src/assets/scss/bundle.scss'],
		dest: 'dist/assets/css'
	},
	images: {
		src: 'src/assets/images/**/*.{jpg,jpeg,png,svg}',
		dest: 'dist/assets/images'
	},
	scripts: {
		src: 'src/assets/js/**/*.js',
		dest: 'dist/assets/js'
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
	gulp.watch('src/assets/css/**/*.scss', styleTask);
	gulp.watch('src/assets/js/**/*.js', scripts);
}

function images(){
	return gulp.src(paths.images.src)
				.pipe(gulpif(PRODUCTION, imagemin()))
				.pipe(gulp.dest(paths.images.dest));
}

function scripts(){
	return gulp.src(paths.scripts.src)
				.pipe(webpack({
					module: {
						rules: [
							{ 
								test: /\.js$/,
								use: ['babel-loader'],
								exclude: /node_modules/
							}
						]
					},
					output: {
						filename: 'main.js'
					},
					devtool: !PRODUCTION ? 'inline-source-map':false
				}))
				.pipe(gulpif(PRODUCTION, uglify()))
				.pipe(gulp.dest(paths.scripts.dest))
}

function build(){
	return gulp.series(clean, gulp.parallel(styleTask, scripts, images))();
}

function dev(){
	return gulp.series(clean, gulp.parallel(styleTask, scripts, images), watch)();
}