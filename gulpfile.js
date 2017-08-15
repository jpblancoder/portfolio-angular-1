var gulp = require('gulp');
var less = require('gulp-less');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var plumber = require('gulp-plumber');
var clean = require('gulp-clean');
var gutil = require('gulp-util');
var autoprefixer = require('gulp-autoprefixer');
var runSequence = require('run-sequence');
var watch = require('gulp-watch'); // wrapper for chokidar
var concat = require('gulp-concat');
var awspublish = require('gulp-awspublish');
var taskListing = require('gulp-task-listing');
var templateCache = require('gulp-angular-templatecache');

var secret = require('./secret.js'); // credentials
var packageName = 'Portfolio';

// this is how you get the relative path from a vinyl file instance
var public_folder = './www';
// console.log(public_folder);

var consoleLogError = function(error) {
    gutil.beep();
    console.log(error.toString());
};

var consoleLogErrorEnd = function(error) {
    gutil.beep();
    console.log(error.toString());
    this.emit('end');
};

var autoprefixer_options = {
    browsers: ['last 8 versions', 'ie 9']
};

gulp.task('less:compile:bootstrap', function() {
    return gulp.src([
            public_folder + '/vendor/bootstrap/less/bootstrap.less',
        ])
        .pipe(plumber({
            errorHandler: consoleLogErrorEnd
        }))
        .pipe(sourcemaps.init())
        .pipe(less())
        // .pipe(autoprefixer(autoprefixer_options))
        .pipe(sourcemaps.write('.', {
            includeContent: false
        }))
        .pipe(gulp.dest(public_folder + '/vendor/bootstrap/less'));
});

gulp.task('less:compile:app', function() {
    return gulp.src([
            public_folder + '/less/app.less'
        ])
        .pipe(plumber({
            errorHandler: consoleLogErrorEnd
        }))
        .pipe(sourcemaps.init())
        .pipe(less())
        // .pipe(autoprefixer(autoprefixer_options))
        .pipe(sourcemaps.write('.', {
            includeContent: false
        }))
        .pipe(gulp.dest(public_folder + '/less'));
});

gulp.task('less:compile', ['less:compile:bootstrap', 'less:compile:app']);

gulp.task('less:clean', function() {
    // clean CSS and CSS.MAP
    return gulp.src([
            public_folder + '/less/app.css',
            public_folder + '/less/app.css.map',
            public_folder + '/vendor/bootstrap/less/bootstrap.css',
            public_folder + '/vendor/bootstrap/less/bootstrap.css.map'
        ], {
            read: false
        })
        .pipe(clean({
            force: true
        }));
});

gulp.task('less:watch', function() {
    return watch([
        public_folder + '/less/**/*.less',
        public_folder + '/vendor/**/*.less'
    ], function(events, done) {
        gulp.start('less:compile');
    });
});

gulp.task('js:compile', function() {
    // keep sourceURLs, but rename them so devtools ignore them
    // devtools will use app.js.map file instead
    return gulp.src([
            public_folder + '/js/module.js',
            public_folder + '/js/config.js',
            public_folder + '/js/directives.js',
            public_folder + '/js/controllers.js',
            public_folder + '/js/templates.js'
            // public_folder + '/js/filters.js',
        ])
        .pipe(sourcemaps.init())
        .pipe(concat('app.js'))
        .pipe(gulp.dest(public_folder + '/js/'))
        .pipe(rename('app.min.js'))
        .pipe(uglify({ mangle: false, output: { ascii_only: true }}))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(public_folder + '/js/'));
});

gulp.task('js:clean', function() {
    // clean JS and JS.MAP
    return gulp.src([
            public_folder + '/js/app.js',
            public_folder + '/js/app.min.js',
            public_folder + '/js/app.min.js.map'
        ], {
            read: false
        })
        .pipe(clean({
            force: true
        }));
});

gulp.task('js:watch', function() {
    return watch([
        public_folder + '/js/*.js',
    ], function(events, done) {
        gulp.start('js:compile');
    });
});

gulp.task('html:clean', function() {
    // clean html templates
    return gulp.src([
            public_folder + '/js/templates.js',
        ], {
            read: false
        })
        .pipe(clean({
            force: true
        }));
});

gulp.task('html:templates', function() {
    return gulp.src([
        '!' + public_folder + '/bower/**/*.html',
        '!' + public_folder + '/index.html',
        public_folder + '/**/*.html'
    ])
    .pipe(templateCache())
    .pipe(gulp.dest(public_folder + '/js'));
});

var publisher = awspublish.create(secret.aws);

gulp.task('deploy', function() {
    return gulp.src([
        public_folder + '/**/*'
    ])
    // .pipe(awspublish.gzip({ ext: '.gz' }))
    .pipe(publisher.publish({
        // 31536000 = 365 days
        'Cache-Control': 'max-age=31536000,s-maxage=31536000,no-transform,public',
        'x-amz-acl': 'public-read'
    }))
    .pipe(publisher.cache())
    .pipe(awspublish.reporter({
        states: ['create', 'update', 'delete']
    }));
});

// build a deployment distribution
gulp.task('build', function(cb) {
    runSequence(['less:clean', 'js:clean'], ['html:clean', 'html:templates'], ['less:compile', 'js:compile'], cb);
});

// for localhost development (re-compile on file changes)
gulp.task('dev', function(cb) {
    runSequence(['less:clean', 'js:clean'], ['html:clean', 'html:templates'], ['less:compile', 'js:compile'], ['less:watch', 'js:watch'], cb);
});

gulp.task('help', taskListing);
