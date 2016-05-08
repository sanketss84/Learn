// Dont forget to return your stream so gulp knows when a task is finished.
// http://stackoverflow.com/questions/25160597/gulp-less-and-then-minify-task

// Gulp 101
// ------------------------------------------------------------------------------
// gulp.src allows us to set source file path
// gulp.dest allows us to set destination file path
// * would mean any file , *.js means all js files in that path
// .pipe allows us to run a command on the source

// Plumber
// ------------------------------------------------------------------------------
// If watch task is active and gulp is running constantly monitoring your folders
// for code changes. If there is an error somewhere in your code then that task might 
// terminate and the gulp will stop running. If you want gulp to continue running then
// plumber will come to your rescue. 

// Plumber will make sure that gulp continues to watch even is there is an error in your code.


// Task Index 
// ------------------------------------------------------------------------------
// 1. default : Default
// 2. scripts : Javascript Minification using uglify
// 3. watch : Watch Task
// 4. Add Plumber
// 5. Non Plumber approach via errorLog Function : not that great !
// 6. AutoPrefixer for LESS SASS CSS
// 7. LESS and SASS Compiler
// 8. File Folder cleanup
// 9. CSS Minification and File Renaming
// 10. JS Concat / Combine
// 11. JS Sourcemap generation
// 12. JS Code Hint + Stylish

var gulp         = require('gulp'),
	plumber      = require('gulp-plumber'),
	clean        = require('gulp-clean'),
    rename       = require('gulp-rename'),
    replace      = require('gulp-replace'),

	uglify       = require('gulp-uglify'), //JS Minify
	concat       = require('gulp-concat'), //Combine JS Files
	sourcemaps   = require('gulp-sourcemaps'), //https://github.com/floridoo/gulp-sourcemaps/wiki/Plugins-with-gulp-sourcemaps-support
	jshint       = require('gulp-jshint'),
    stylish      = require('jshint-stylish'),

	less         = require('gulp-less'),
	sass         = require('gulp-sass'),
	cssmin       = require('gulp-cssmin'),
	prefix       = require('gulp-autoprefixer');


// TRY : Array of multiple source paths 
var gulpVariables = {

	cleanupBuildPaths     : ['build/js/*.js','build/css/*.css'],

	jsCombineFileSequence : ['asset/js/one.js','asset/js/two.js','asset/js/test.js'],
	jsCombinedFile        :  'main.js',

	jsSrcPath             : 'asset/js/*.js',
	jsDestPath            : 'build/js',
	lessSrcPath           : 'asset/less/*.less',
	scssSrcPath           : 'asset/scss/*.scss',
	cssDestPath           : 'build/css',

	replaceTestSrc        : 'asset/replaceTest/*.*',
	replaceTestDest       : 'build/replaceTest'
};

// Default Task
// Run as : gulp
// This is the default task that gulp will always run 
// gulp.task('default',function(){
// 	console.log('Hello World');
// });

// Default Task
	// ------------------------------------------------------------------------------

	// Pass an array of tasks to call
	// NOTE: Here the order of tasks in array is important, thats the sequence of task execution
	// Cleanup should be at start and watch should be at end
	gulp.task('default', ['cleanup','scripts','scripts-adv','less','less-adv','sass','watch']);

// Watch Task
	// ------------------------------------------------------------------------------
	// Run as : gulp watch
	// Run this 'script' task everytime js file has been saved.

	gulp.task('watch',function(){

		gulp.watch(gulpVariables.jsSrcPath , ['scripts']);
		// gulp.watch(gulpVariables.jsSrcPath , ['scripts-noplumber']);
		gulp.watch(gulpVariables.lessSrcPath , ['less']);
		gulp.watch(gulpVariables.scssSrcPath , ['sass']);

	});

// File and Folder Cleanup
	// ------------------------------------------------------------------------------
	// https://www.npmjs.com/package/gulp-clean

	// Cleans array of build paths
	// Option read:false prevents gulp from reading the contents of the file and makes this task a lot faster. 
	// If you need the file and its contents after cleaning in the same stream, do not set the read option to false.
	// Can be file type : 'build/js/*.js' or just path ''build/js/ this will

	// NOTE : For safety files and folders outside the current working directory can be removed only with option force set to true.
	// .pipe(clean({force: true}))

	gulp.task('cleanup', function () {
		
		return gulp.src(gulpVariables.cleanupBuildPaths, {read: false})
			       .pipe(clean());
	});

// Javascript Code Linting
	// jshint + stylish 
	// ------------------------------------------------------------------------------
	gulp.task('jshint',function(){

		return gulp.src(gulpVariables.jsSrcPath)
				   .pipe(plumber())
				   .pipe(jshint())
		    	   .pipe(jshint.reporter(stylish));	

	});

// Javascript Minification Task
	// ------------------------------------------------------------------------------
	// Run as : gulp scripts
	// What this does : It will get all JS files from source > Minify > put it in dest 

	gulp.task('scripts',function(){

		return gulp.src('asset/js/*.js')
			       .pipe(plumber()) // NOTE: Make sure this is running before everything else 
			       .pipe(uglify())
			       .pipe(rename({suffix: '.min'})) //If you want to rename files to .min
			       .pipe(gulp.dest('build/js'));

	});

// Javascript Minification Task - Non Plumber Version
	// ------------------------------------------------------------------------------
	// Run as : gulp scripts
	// What this does : It will get all JS files from source > Minify > put it in dest 

	gulp.task('scripts-noplumber',function(){

		return gulp.src('asset/js/*.js')
			       .pipe(uglify())
			       // .on('error', console.error.bind(console)) //Method 1 : Direct Way
			       .on('error', errorLog) //Method 2 : Create errorLog Function and pass error to it
			       .pipe(gulp.dest('build/js'));

	});

	//This is allowing watch to continue but is not displaying the error :(
	//Works Partially best is method 1
	function errorLog (error){
		// console.error.bind(error);
		// this.emit('end');
		console.error(error.message);
	}

// Javascript Advanced
	// Concat / Combine > Generate main.js > Minify > add .min > save to destination
	// Gives two files main.js and main.min.js
	// ------------------------------------------------------------------------------

	gulp.task('scripts-adv', ['cleanup'],  function() {

	  return gulp.src(gulpVariables.jsCombineFileSequence) //gulp.src('./lib/*.js') will also work
	  			 .pipe(plumber()) // NOTE: Make sure this is running before everything else 
			     .pipe(concat(gulpVariables.jsCombinedFile)) //This is just a file name and no path
			     .pipe(gulp.dest(gulpVariables.jsDestPath))

			     .pipe(uglify()) //JS Minify
			     .pipe(rename({suffix: '.min'})) //Optional step added to rename
			     .pipe(gulp.dest(gulpVariables.jsDestPath));

	});

// Javascript Advanced + SourceMap Generation
	// Concat > Minify > Add .min > save to destination
	// Gives two files main.js and main.min.js and generates sourcemaps as well

	// https://www.npmjs.com/package/gulp-sourcemaps
	// NOTE: All plugins between sourcemaps.init() and sourcemaps.write() need to have support for gulp-sourcemaps. 
	// https://github.com/floridoo/gulp-sourcemaps/wiki/Plugins-with-gulp-sourcemaps-support

	// What are Source Maps?
	// Source maps offer a language-agnostic way of mapping production code to the original code that was authored.
	// http://blog.teamtreehouse.com/introduction-source-maps
	// http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/
	// http://code.tutsplus.com/tutorials/source-maps-101--net-29173
	// ------------------------------------------------------------------------------

	gulp.task('scripts-adv-srcmap', ['cleanup'],  function() {

	  return gulp.src(gulpVariables.jsCombineFileSequence) //gulp.src('./lib/*.js') will also work
	  			 .pipe(plumber()) // NOTE: Make sure this is running before everything else 

	  			 .pipe(sourcemaps.init())
			     	.pipe(concat(gulpVariables.jsCombinedFile))
			     // .pipe(sourcemaps.write()) // To same file
			     .pipe(sourcemaps.write('/maps')) //To write external source map files, pass a path relative to the destination to sourcemaps.write().

			     .pipe(gulp.dest(gulpVariables.jsDestPath))

			     .pipe(uglify()) //JS Minify
			     .pipe(rename({suffix: '.min'})) //Optional step added to rename
			     .pipe(gulp.dest(gulpVariables.jsDestPath));

	});



// LESS to CSS Compilation Task
	// LESS 2 CSS > AutoPrefixer
	// ------------------------------------------------------------------------------
	// So you dont need to use mixins or compass for adding your prefixes
	// https://davidwalsh.name/goodbye-vendor-prefixes
	// Added using .pipe(prefix('last 2 versions'))

	// Less CSS Compilation Task
	// ------------------------------------------------------------------------------
	// Run as : gulp less
	// What this does : It will get all JS files from source > Minify > put it in dest 

	gulp.task('less',function(){

		return gulp.src(gulpVariables.lessSrcPath)
			       .pipe(plumber()) // NOTE: Make sure this is running before everything else 
			       .pipe(less())
			       .pipe(prefix('last 2 versions')) // https://github.com/postcss/autoprefixer , last two versions of all browsers
			       .pipe(gulp.dest(gulpVariables.cssDestPath));

	});

// Less Advanced
	// LESS 2 CSS > AutoPrefixer > Save File > Minify > Rename .min > Save .min version
	// ------------------------------------------------------------------------------
	// Dont forget to return your stream so gulp knows when a task is finished.
	// http://stackoverflow.com/questions/25160597/gulp-less-and-then-minify-task
	gulp.task('less-adv', ['cleanup'], function () {

	  /*
	  return gulp.src('gulpVariables.lessSrcPath')
			     .pipe(less().on('error', function (err) {
			       console.log(err);
			     }))
			     .pipe(cssmin().on('error', function(err) {
			       console.log(err);
			     }))
			     .pipe(rename({suffix: '.min'}))
			     .pipe(gulp.dest(gulpVariables.cssDestPath)); */

	  return gulp.src(gulpVariables.lessSrcPath)
	  			 .pipe(plumber()) 
			     .pipe(less())
			     .pipe(prefix('last 2 versions')) // https://github.com/postcss/autoprefixer , last two versions of all browsers
			     .pipe(gulp.dest(gulpVariables.cssDestPath))

			     .pipe(cssmin()) //CSS Minification
			     .pipe(rename({suffix: '.min'}))
			     .pipe(gulp.dest(gulpVariables.cssDestPath));

	});

// SASS to CSS Compilation Task
	// ------------------------------------------------------------------------------
	// Run as : gulp less
	// What this does : It will get all JS files from source > Minify > put it in dest 

	gulp.task('sass',function(){

		return gulp.src(gulpVariables.scssSrcPath)
		           .pipe(plumber()) // NOTE: Make sure this is running before everything else 
		           // .pipe(sass())
		           .pipe(sass({
		           	style: 'expanded' //options : compressed , expanded
		           	}))
		           // .pipe(prefix('last 2 versions')) // https://github.com/postcss/autoprefixer , last two versions of all browsers
		           .pipe(gulp.dest(gulpVariables.cssDestPath));

	});


// Image Compression
// ------------------------------------------------------------------------------


// CSS Minification
// ------------------------------------------------------------------------------

// JS Lint
// ------------------------------------------------------------------------------

// Search and Replace
	// ------------------------------------------------------------------------------
	gulp.task('replace',function(){
		
			return gulp.src(gulpVariables.replaceTestSrc)
			           .pipe(plumber()) // NOTE: Make sure this is running before everything else 
			           .pipe(replace('Lorem Ipsum is simply dummy text','Lorem Ipsum is simply dummy text')) // NOTE: Make sure this is running before everything else 
			           .pipe(gulp.dest(gulpVariables.replaceTestDest));
	});