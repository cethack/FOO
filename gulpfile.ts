import {PATH} from './gulp.config';

var gulp = require('gulp-help')(require('gulp'));
var karma = require('karma');
var printFiles = require('gulp-print');
var browserSync = require('browser-sync');
var modRewrite = require('connect-modrewrite');
var sourcemaps = require('gulp-sourcemaps');
var tsc = require('gulp-typescript');
var tslint = require('gulp-tslint');
var less = require('gulp-less');
var del = require('del');
var runSequence = require('run-sequence');
var plumber = require('gulp-plumber');
var inlineNg2Template = require('gulp-inline-ng2-template');

var _ = require('lodash');
var argv = require('yargs').argv;

gulp.task('default', 'list gulp tasks with description', ['help']);

gulp.task('build', 'build static files from source code', ['build:clean'], (callback: any) => {
  runSequence(
    'build:tslint',
    'build:js',
    'build:html',
    'build:lib',
    'build:css',
    'build:icons',
    'build:assets',
    'build:configFiles',
    callback
  );
});

gulp.task('serve', 'run a web server and watch *.ts, *.html and *.css files', [
  'serve:browser-sync',
  'serve:watch'
]);

gulp.task('test', 'run tests', (callback: any) => {
  if (argv.files) {
    runSequence(
      'test:copy',
      'test:tslint',
      'test:buildjs',
      'test:unit',
      callback
    );
  } else {
    runSequence(
      'test:clean',
      'test:copy',
      'test:tslint',
      'test:buildcss',
      'test:buildjs',
      'test:unit',
      callback
    );
  }
});

//-----------------------------------------------------------
//  build
//-----------------------------------------------------------
var tsProjectFn = () => {
  return tsc.createProject('tsconfig.json');
};

gulp.task('build:clean',  'delete build directory', () => {
  return del(PATH.dest.base);
});

gulp.task('build:tslint', 'run tslint for *.ts files', () => {
  return gulp.src(PATH.src.ts)
    .pipe(tslint())
    .pipe(tslint.report('verbose', {
      emitError: false
    }));
});

gulp.task('build:js', 'compile *.ts files into *.js files', ['build:tslint'], () => {
  var tsProject = tsProjectFn();

  var tsResult = gulp.src(PATH.src.ts)
    .pipe(printFiles())
    .pipe(sourcemaps.init())
    .pipe(tsc(tsProject));

  return tsResult.js
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(PATH.dest.base));
});

gulp.task('build:vendor', 'copy vendor files to build directory', () => {
  return gulp.src(PATH.src.vendors.css)
    .pipe(gulp.dest(PATH.dest.base));
});

gulp.task('build:css', 'compile *.less files into *.css files', ['build:vendor'], () => {
  return gulp.src(PATH.src.less)
    .pipe(sourcemaps.init({ debug: true }))
    .pipe(less())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(PATH.dest.base));
});

gulp.task('build:html', 'build html files into build directory', () => {
  return gulp.src(PATH.src.html)
    .pipe(gulp.dest(PATH.dest.html));
});

gulp.task('build:icons', 'build image files into build directory', () => {
  return gulp.src(PATH.src.icons)
    .pipe(gulp.dest(PATH.dest.base));
});

gulp.task('build:assets', 'build image files into build directory', () => {
  return gulp.src(PATH.src.assets)
    .pipe(gulp.dest(PATH.dest.assets));
});

gulp.task('build:configFiles', 'copy config files into build directory', () => {
  return gulp.src(PATH.src.json)
    .pipe(gulp.dest(PATH.dest.base));
});

gulp.task('build:lib', 'build 3rd party files into build directory', () => {
  return gulp.src(PATH.src.deps)
    .pipe(gulp.dest(PATH.dest.lib));
});

//-----------------------------------------------------------
// test
//-----------------------------------------------------------
gulp.task('test:clean', 'Clear Test Files', (done: any) => {
  return del('test');
});

gulp.task('test:copy', 'copy source codes into test directory', () => {
  let src = argv.files ? `*${(argv.files || '').replace('*','')}*` : '*';
  return gulp.src('src/**/' + src)
    .pipe(printFiles())
    .pipe(gulp.dest('test/src'));
});

gulp.task('test:tslint', 'Tslint on test files', (done: any) => {
  let src = argv.files ? `*${(argv.files || '').replace('*','')}*` : '*';
  return gulp.src(`test/src/**/${src}.ts`)
    .pipe(printFiles())
    .pipe(tslint())
    .pipe(tslint.report('verbose', {
      emitError: false,
      sort: true,
      bell: true
    }));
});

gulp.task('test:buildcss', 'Compile less for inline implementation', () => {
  return gulp.src([
      `test/src/**/*.less`,
      `!test/src/assets/styles/partials/**/*`,
      `!test/src/assets/vendors/**/*`
    ])
    .pipe(less())
    .pipe(gulp.dest('test/src'));
});

gulp.task('test:buildjs', 'Compile typescript test files', () => {
  let src = argv.files ? `*${(argv.files || '').replace('*','')}*` : '*';
  var tsProject = tsProjectFn();

  var result = gulp.src([
      'typings/browser.d.ts',
      `test/src/**/${src}.ts`
    ])
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(inlineNg2Template({base: 'test/src', useRelativePaths: true}))
    .pipe(tsc(tsProject));

  return result.js
    .pipe(printFiles())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('test/src'));
});

gulp.task('test:unit', 'Start a karma server and run a unit test', (done: any) => {
  return new karma.Server({
    configFile: __dirname + '/karma.config.js',
    singleRun: true,
    client: { // Passing command line arguments to tests
      files: argv.files
    }
  }).start(done);
});

//-----------------------------------------------------------
// watch
//-----------------------------------------------------------
gulp.task('serve:watch', 'watch *.ts, *.html and *.less files and reload associated files', () => {
  var logger = (event: any, type: string) => {
    console.log('[' + type + ' changed] ', event.path);
  };

  gulp.watch([PATH.src.ts], ['build:js', browserSync.reload])
    .on('change', (event: any) => logger(event, 'Typescript'));
  gulp.watch([PATH.src.html], ['build:html', browserSync.reload])
    .on('change', (event: any) => logger(event, 'HTML'));
  gulp.watch([PATH.src.less, PATH.src.partial.less], ['build:css', browserSync.reload])
    .on('change', (event: any) => logger(event, 'LESS'));
});

gulp.task('serve:browser-sync', 'init the browserSync server', ['build'], () => {
  browserSync.init({
    port: 3002,
    logLevel: 'info',
    logPrefix: 'FAR Client',
    server: {
      baseDir: `${PATH.dest.base}`,
      middleware: [
        modRewrite([
          '^[^\\.]*$ /index.html [L]'
        ])
      ]
    },
    browser: 'google chrome'
  });
});
