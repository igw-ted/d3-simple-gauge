'use strict'
module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        babel: {
            dist: {
                files: {
                    'dist/Gauge.es5.js': 'src/Gauge.js'
                }
            }
        },
        uglify: {
            build: {
                src: 'dist/Gauge.es5.js',
                dest: 'dist/Gauge.min.js'
            }
        }
    });
    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask('default', ['babel', 'uglify']);
};
