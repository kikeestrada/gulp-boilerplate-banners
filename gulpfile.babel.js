import gulp from 'gulp'
import plumber from 'gulp-plumber'
import pug from 'gulp-pug'
import browserSync from 'browser-sync'
import sass from 'gulp-sass'
import postcss from 'gulp-postcss'
import cssnano from 'cssnano'
import watch from 'gulp-watch'
import browserify from 'browserify'
import babelify from 'babelify'
import source from 'vinyl-source-stream'
import sourcemaps from 'gulp-sourcemaps'
import buffer from 'vinyl-buffer'
import minify from 'gulp-minify'
import imagemin from 'gulp-imagemin'
import sitemap from 'gulp-sitemap'
import cachebust from 'gulp-cache-bust'
import tildeImporter from 'node-sass-tilde-importer'
import humans from 'gulp-humans'
import data from 'gulp-data'
import fs from 'fs'
import uncss from 'gulp-uncss'
import cleanCSS from 'gulp-clean-css'
import stripCssComments from 'gulp-strip-css-comments';
import formatHtml from 'gulp-format-html';
const server = browserSync.create();

const dir = {
	src   : 'src',
	dist  : 'public',
	nm    : 'node_modules',
};

const postcssPlugins = [
	cssnano({
		core: true,
		zindex: false,
		autoprefixer: {
			add: true,
			browsers: '> 1%, last 2 versions, Firefox ESR, Opera 12.1'
		}
	})
];

gulp.task('styles-dev', () => {
	gulp.src('./src/scss/styles.scss')
		.pipe(sourcemaps.init({ loadMaps : true}))
		.pipe(plumber())
		.pipe(sass({
			importer: tildeImporter,
			outputStyle: 'expanded',
			includePaths: ['./node_modules']
		}))
		.pipe(postcss(postcssPlugins))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('./public/assets/'))
		.pipe(server.stream({match: '**/*.css'}))
});

gulp.task('styles-build', () => {
	gulp.src('./src/scss/styles.scss')
		.pipe(plumber())
		.pipe(sass({
			outputStyle: 'compressed',
			importer: tildeImporter,
			includePaths: ['./node_modules']
		}))
		.pipe(postcss(postcssPlugins))
		.pipe(cleanCSS({
			advanced: false,
			keepBreaks: false,
			keepSpecialComments: 0,
			compatibility: ''
		}))
		.pipe(stripCssComments({
			preserve: false
		}))
		// .pipe(uncss({
		// 	html : [
		// 		'./public/*.html'
		// 	],
		// 	ignore: [
		// 		'tag.class'
		// 	],
		// 	ignoreSheets: [
		// 		//
		// 	]
		// }))
		.pipe(gulp.dest('./public/assets/'))
});

gulp.task('pug-dev', () =>
	gulp.src('./src/pug/index.pug')
		.pipe(plumber())
		.pipe(data(function(file) {
			return 	JSON.parse(fs.readFileSync(`${dir.src}/data/example.json`))
		}))
		.pipe(pug({
			pretty: true,
			basedir: './src/pug'
		}))
		.pipe(formatHtml())
		.pipe(gulp.dest('./public'))
);

gulp.task('pug-build', () =>
	gulp.src('./src/pug/pages/**/*.pug')
		.pipe(plumber())
		.pipe(data(function(file) {
			return 	JSON.parse(fs.readFileSync(`${dir.src}/data/example.json`))
		}))
		.pipe(pug({
			basedir: './src/pug'
		}))
		.pipe(gulp.dest('./public'))
);

gulp.task('scripts-dev', () =>
	browserify('./src/js/index.js')
		.transform(babelify, {
			global: true // permite importar desde afuera (como node_modules)
		})
		.bundle()
		.on('error', function (err) {
			console.error(err);
			this.emit('end')
		})
		.pipe(source('scripts.js'))
		.pipe(buffer())
		.pipe(minify({
			ext: {
				src: '-min.js',
				min: '.js'
			}
		}))
		.pipe(sourcemaps.init({loadMaps: true}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('./public/assets/'))
);

gulp.task('scripts-build', () =>
	browserify('./src/js/index.js')
		.transform(babelify, {
			global: true // permite importar desde afuera (como node_modules)
		})
		.bundle()
		.on('error', function (err) {
			console.error(err)
			this.emit('end')
		})
		.pipe(source('scripts.js'))
		.pipe(buffer())
		.pipe(minify({
			ext: {
				src: '.js',
				min: '-min.js'
			}
		}))
		.pipe(sourcemaps.init({loadMaps: true}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('./public/assets/'))
);

gulp.task('images-build', () => {
	gulp.src('./src/img/**/**')
		.pipe(imagemin([
			imagemin.gifsicle({interlaced: true}),
			imagemin.jpegtran({progressive: true}),
			imagemin.optipng({optimizationLevel: 5}),
			imagemin.svgo()
		]))
		.pipe(gulp.dest('./public/assets/'))
});

gulp.task('images-dev', () => {
	gulp.src('./src/img/**/**')
		.pipe(gulp.dest('./public/assets/'))
});

gulp.task('dev', [
	'styles-dev', 
	'pug-dev', 
	'scripts-dev', 
	'images-dev'
], () => {
	server.init({
		server: {
			baseDir: './public'
		}
	});
	watch('./src/scss/**/**', 		() => gulp.start('styles-dev'));
	watch('./src/js/**/**', 		() => gulp.start('scripts-dev', server.reload));
	watch('./src/pug/**/**', 		() => gulp.start('pug-dev', server.reload));
	watch('./src/img/**/**', 		() => gulp.start('images-dev'))
});

gulp.task('cache', () => {
	gulp.src('./public/**/*.html')
		.pipe(cachebust({
			type: 'timestamp'
		}))
		.pipe(gulp.dest('./public'))
});

gulp.task('build', [
	'pug-build', 
	'scripts-build', 
	'images-build', 
	'cache', 
	'styles-build'
], () => {
	server.init({
		server: {
			baseDir: './public'
		}
	});
});
