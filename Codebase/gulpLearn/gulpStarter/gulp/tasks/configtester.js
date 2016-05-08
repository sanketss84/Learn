// Naming Conventions 
// http://www.w3schools.com/js/js_conventions.asp
// Global variables written in UPPERCASE 
// Constants (like PI) written in UPPERCASE
// Always use lower case file names for all files , images, js, css, html etc.
// Hyphens can be mistaken as subtraction attempts. Hyphens are not allowed in JavaScript names.

var gulp       = require('gulp');

var configOne  = require('../config');                // Method 1
var configTwo  = require('../config').configtester;   // Method 2

gulp.task('configtester', function() {

	console.log('Calling configtester !!!! \n');
    console.log('Method 1 : '+ configOne.configtester.message);  // Method 1
    console.log('Method 2 : '+ configTwo.message);               // Method 2

});

