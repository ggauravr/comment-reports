var path = require('path');

module.exports = function(grunt){

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            options: {
                jshintrc: true
            },
            all: {
                src: [ 'index.js', 'src/**/*.js', 'test/**/*.js' ]
            }
        },

        mochacli: {
            options: {
                require: [ 'chai' ]
            },
            all: [ 'test/**/*.js' ]
        },

        dustjs: {
            compile: {
                files: [{
                    expand: true,
                    cwd: 'public/templates/',
                    src: '**/*.dust',
                    dest: 'dist/templates',
                    ext: '.js'
                }],
                options: {
                    fullname: function(filepath) {
                        // [[TODO]] remove hard-coded index, handle it better
                        var dirName = path.dirname(filepath).split(path.sep).slice(2).join(path.sep),
                            templateName =  (dirName ? (dirName + path.sep) : '') + path.basename(filepath, '.dust');
                        console.log("dirname" + templateName);
                        return templateName;
                    }
                }
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-dustjs');
    grunt.loadNpmTasks('grunt-mocha-cli');

    grunt.registerTask('test', [ 'mochacli' ]);
    grunt.registerTask('default', []);
    grunt.registerTask('build', [ 'jshint', 'dustjs', 'mochacli' ]);

};