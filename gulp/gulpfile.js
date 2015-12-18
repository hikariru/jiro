var gulp = require('gulp');
var typescript = require('gulp-typescript');
var concat = require('gulp-concat');

var typescriptProject = typescript.createProject({
    target: "ES5",
    removeComments: true,
    sortOutput: true
});

gulp.task('ts-compile', function(){
    gulp.src(['../src/ts/**/*.ts'])
        .pipe(typescript(typescriptProject))
        .js
        .pipe(concat("main.js"))
        .pipe(gulp.dest('../client/js/'));
});

gulp.task('watch', function(){
    gulp.watch('../src/ts/**/*.ts', ['ts-compile']);
});

gulp.task('default', ['ts-compile', 'watch']);