var gulp = require('gulp');
var shell = require('gulp-shell');
var browserSync = require('browser-sync').create();
const siteRoot = "_site/"

// Task for building blog when something changed:
gulp.task('build', shell.task(["bundle exec jekyll serve"]));
// If you don't use bundle:
// gulp.task('build', shell.task(['jekyll serve']));
// If you use  Windows Subsystem for Linux (thanks @SamuliAlajarvela):
// gulp.task('build', shell.task(['bundle exec jekyll serve --force_polling']));

// Task for serving blog with Browsersync
gulp.task('serve', function () {
    browserSync.init({
					files: [siteRoot + '/**'],
					proxy: "localhost:3000",
                    host: "localhost"});
    // Reloads page when some of the already built files changed:
    gulp.watch('_site/**/*.*').on('change', browserSync.reload);
});

gulp.task('default', ['build', 'serve']);
