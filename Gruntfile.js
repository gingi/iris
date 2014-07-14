module.exports = function (grunt) {
    var testTargets = grunt.option("test") || "test/**/*.js";
    grunt.initConfig({
        env: {
            test: {
                NODE_ENV: "test"
            }
        },
        pkg: grunt.file.readJSON("package.json"),
        mochaTest: {
            unit: {
                options: {
                    reporter: "spec",
                    ui: "bdd",
                    require: "should"
                },
                src: [testTargets]
            }
        }
    });

    grunt.loadNpmTasks("grunt-env");
    grunt.loadNpmTasks("grunt-shell");
    grunt.loadNpmTasks("grunt-bower-install-simple");
    grunt.loadNpmTasks("grunt-mocha-test");

    grunt.registerTask("test", ["env:test", "mochaTest"]);
    grunt.registerTask("bower", ["bower-install-simple"]);
    grunt.registerTask("default", ["test"]);
};