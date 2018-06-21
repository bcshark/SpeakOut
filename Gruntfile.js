module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        watch: {
            scripts: {
                files: [
                    "src/config/*.js",
                    "src/controllers/*.js",
                    "src/services/*.js"
                ],
                tasks: [
                    "ngAnnotate",
                    "jshint",
                    "concat:stage1",
                    "concat:stage2",
                    "uglify"
                ]
            }
        },
        concat: {
            options: {
                separator: ";",
                stripBanners: true
            },
            stage1: {
                files: {
                    "src/dist/config.intrm.js": [
                        "src/config/*.js"
                    ],
                    "src/dist/controllers.intrm.js": [
                        "src/dist/src/controllers/*.js"
                    ],
                    "src/dist/services.intrm.js": [
                        "src/dist/src/services/*.js"
                    ]
                }
            },
            stage2: {
                files: {
                    "src/dist/index.intrm.js": [
                        "src/dist/config.intrm.js",
                        "src/dist/services.intrm.js",
                        "src/dist/controllers.intrm.js"
                    ]
                }
            },
        },
        uglify: {
            options: {},
            dist: {
                files: {
                    "src/index.min.js": "src/dist/index.intrm.js"
                }
            }
        },
        jshint: {
            files: [
                "src/config/*.js",
                "src/controllers/*.js",
                "src/services/*.js"
            ],
            options: {
                globals: {
                    jQuery: true,
                    console: true,
                    module: true,
                    document: true
                }
            }
        },
        ngAnnotate: {
            options: {
                singleQuotes: true
            },
            app: {
                files: [{
                    expand: true,
                    src: [
                        "src/controllers/*.js",
                        "src/services/*.js"
                    ],
                    rename: function(dest, src) { return "src/dist/" + src; },
                }]
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-ng-annotate");

    // grunt.registerTask("default", ["ngAnnotate", "jshint", "concat", "uglify", "cssmin", "watch"]);
    grunt.registerTask("default", [
        "ngAnnotate",
        "jshint",
        "concat:stage1",
        "concat:stage2",
        "uglify",
        "watch"
    ]);
}