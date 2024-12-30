"use strict";

const {
    src,
    dest,
    parallel,
    series,
    watch
} = require('gulp');
const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss');
const pug = require('gulp-pug');
const concat = require('gulp-concat');

// Concat All JS Files
function concatAllJS() {
    return src([
            'node_modules/bootstrap/dist/js/bootstrap.bundle.min.js',
            'static/js/slideToggle.min.js',            
            'static/js/countdown.min.js',
            'static/js/zoom.min.js',
            'static/js/dark.js',
            'node_modules/tiny-slider/dist/min/tiny-slider.js',
            'node_modules/counterup2/dist/index.js',
            'node_modules/imagesloaded/imagesloaded.pkgd.min.js',
            'node_modules/isotope-layout/dist/isotope.pkgd.min.js',
            'node_modules/nice-select2/dist/js/nice-select2.js',
            'node_modules/vanilla-rangeslider/js/rangeslider.min.js',
            'node_modules/aos/dist/aos.js',
            'node_modules/apexcharts/dist/apexcharts.min.js'
        ])
        .pipe(concat('all-js-libraries.js'))
        .pipe(gulp.dest('dist/js'));
}

// Move CSS to dist/css
function concatAllCSS() {
    return src([
            'node_modules/bootstrap/dist/css/bootstrap.min.css',
            'node_modules/bootstrap-icons/font/bootstrap-icons.css',
            'node_modules/tiny-slider/dist/tiny-slider.css',
            'node_modules/nice-select2/dist/css/nice-select2.css',
            'node_modules/vanilla-rangeslider/css/rangeslider.css',
            'node_modules/aos/dist/aos.css',
            'node_modules/apexcharts/dist/apexcharts.css'
        ])
        .pipe(concat('all-css-libraries.css'))
        .pipe(gulp.dest('dist/css'));
}

// Move Bootstrap Icons to dist/fonts
function bootstrapIcons() {
    return src('node_modules/bootstrap-icons/font/fonts/*')
        .pipe(dest('dist/css/fonts'));
}

// Move static Images to dist/img
function staticImg() {
    return src([
            'static/img/*',
            'static/img/*/*',
            'static/img/*/*/*',
            'static/img/*/*/*/*',
            'static/img/*/*/*/*/*'
        ])
        .pipe(dest('dist/img'));
}

// Watching All Static JS Files
function staticJS() {
    return src('static/js/*.js')
        .pipe(dest('dist/js'));
}

// Pug to HTML Convert
function pugToHtml() {
    return src('src/pug/*.pug')
        .pipe(pug({
            pretty: true
        }))
        .pipe(dest('dist/'));
}

// SCSS to CSS Convert
function sassToCss() {
    return src('src/scss/*.scss')
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(postcss([autoprefixer({
            overrideBrowserslist: ['last 2 versions']
        })]))
        .pipe(dest('dist/'))
}

// SCSS - Pug Watching
function watching() {
    watch('src/scss/*.scss', series(sassToCss));
    watch(['src/pug/*.pug', 'src/pug/*/*.pug'], series(pugToHtml));
    watch(['static/img/*', 'static/img/*/*', 'static/img/*/*/*', 'static/img/*/*/*/*', 'static/img/*/*/*/*/*'], series(staticImg));
    watch('static/js/*', series(staticJS));
}

const watchAll = parallel(watching);

exports.watch = watchAll;
exports.default = series(concatAllJS, concatAllCSS, bootstrapIcons, staticImg, staticJS, pugToHtml, sassToCss, watching);