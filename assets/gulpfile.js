const { src, dest } = require('gulp');
const sass = require('gulp-sass');
const minifyCSS = require('gulp-csso');
const concat = require('gulp-concat');
const gulp = require("gulp");
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const rigger = require('gulp-rigger');
const uglify = require('gulp-uglify');
const svgSprite = require('gulp-svg-sprite');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');

svgConfig = {
    mode: {
        stack: {
            sprite: "../sprites.svg"
        }
    },
};

function sync() {
    browserSync.init({
        proxy: 'emko.loc/',
        notify: false
    });

    const watcher = gulp.watch('components/*/*.scss');
    watcher.on('change', function(path) {
        css();
        console.log(`File ${path} was changed`);
        browserSync.reload();
    });
}


function css() {
    return src('components/core/core.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .on("error", sass.logError)
        .pipe(minifyCSS())
        .pipe(concat('../../css/style.css'))
        .pipe(sourcemaps.write())
        .pipe(dest('css'));
}

function prefix() {
    return src('components/core/core.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(postcss([autoprefixer({browsers: ['last 2 versions']})]))
        .on("error", sass.logError)
        .pipe(minifyCSS())
        .pipe(concat('../../css/style.css'))
        .pipe(dest('css'))
}

function vendor(){
    return src('components/core/vendor.scss')
        .pipe(sass())
        .on("error", sass.logError)
        .pipe(minifyCSS())
        .pipe(concat('../../css/vendor.css'))
        .pipe(dest('css'))
}

function js() {
    return src('components/core/vendor.js')
        .pipe(rigger()) // импортируем все указанные файлы в main.js
        .pipe(uglify()) // минимизируем js
        .pipe(gulp.dest('../js'))
}

function svg(){
    gulp.src('svg/*.svg')
        .pipe(svgSprite(svgConfig))
        .pipe(gulp.dest('../images'));
}

function watch(){
    const watcher = gulp.watch('components/*/*.scss');
    watcher.on('change', function (path) {
        css(); //styles task
        console.log(`File ${path} was changed`);
    })
}


exports.vendor = vendor;
exports.js = js;
exports.css = css;
exports.sync = sync;
exports.svg = svg;
exports.prefix = prefix;

exports.default = gulp.series(watch);