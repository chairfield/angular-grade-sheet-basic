var gulp = require('gulp'),
    livereload = require('gulp-livereload');

gulp.task('default', function() {
    livereload.listen({
        port: 35729
    });
    gulp.watch(['index.html', 'js/grade-sheet.js'], function() {
        livereload.reload();
    });
});
