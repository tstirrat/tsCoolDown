const gulp = require('gulp');
var cp = require('child_process');

const paths = {
  addon: 'MyAddon/**/*.ts',
};

gulp.task('watch', gulp.series(build, watch));

function watch() {
  return gulp.watch(paths.addon, build);
}

function build() {
  return cp.spawn('npm', ['run', 'build'], { stdio: 'inherit' });
}
