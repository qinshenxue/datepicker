var gulp = require('gulp'),
    rename = require("gulp-rename"),
    cleanCss = require("gulp-clean-css"),
    uglify = require('gulp-uglify');

gulp.task('js', function () {
    return gulp.src('src/*.js')
        .pipe(uglify())
        .pipe(rename({extname: ".min.js"}))
        .pipe(gulp.dest('dist/'));
});

gulp.task('css', function () {
    return gulp.src(['src/*.css'])
        .pipe(cleanCss())
        .pipe(rename({extname: ".min.css"}))
        .pipe(gulp.dest('dist/'));
});

gulp.task('default', ['js', 'css']);
