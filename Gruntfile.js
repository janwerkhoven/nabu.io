module.exports = function(grunt) {

  'use strict';
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    connect: {
      server: {
        options: {
          port: 9000,
          base: 'dist',
          livereload: true,
          open: false
        }
      }
    },
    watch: {
      handlebars: {
        files: ['app/templates/**/*.hbs', 'app/templates/**/*.json', 'app/templates/layout.html '],
        tasks: 'handlebarslayouts'
      },
      sass: {
        files: ['app/sass/**/*.scss'],
        tasks: ['sass']
      },
      js: {
        files: ['app/js/**/*.js'],
        tasks: ['jshint', 'concat', 'uglify']
      },
      gruntfile: {
        files: ['Gruntfile.js'],
        tasks: ['handlebarslayouts', 'sass', 'jshint', 'concat', 'uglify']
      },
      options: {
        livereload: true,
      }
    },
    handlebarslayouts: {
      dist: {
        files: [{
          expand: true,
          cwd: 'app/templates/',
          src: ['**/*.hbs', '!partials/*'],
          dest: 'dist/',
          ext: '.html',
        }],
        options: {
          partials: ['app/templates/partials/*.hbs', 'app/templates/layout.html'],
          basePath: 'app/templates/',
          modules: ['app/templates/helpers/helpers-*.js'],
          context: {
            title: 'MOSHI MOSH <%= grunt.filename %>',
            projectName: 'Grunt handlebars layout',
            items: [
              'apple',
              'orange',
              'banana'
            ]
          }
        }
      }
    },
    sass: {
      dist: {
        options: {
          style: 'compressed',
          noCache: true
        },
        files: {
          'dist/assets/css/main.min.css': 'app/sass/main.scss'
        }
      }
    },
    jshint: {
      files: ['app/js/*.js'],
      options: {
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    },
    concat: {
      options: {
        separator: ';\n\n',
      },
      dist: {
        src: ['app/js/libs/jquery.js', 'app/js/libs/velocity.js', 'app/js/libs/modernizr.js', 'app/js/libs/waypoints.js', 'app/js/main.js'],
        dest: 'dist/assets/js/main.js',
      },
    },
    uglify: {
      dist: {
        files: {
          'dist/assets/js/main.min.js': ['dist/assets/js/main.js']
        }
      }
    }
  });

  // load tasks
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks("grunt-handlebars-layouts");
  grunt.loadNpmTasks('grunt-html-prettyprinter');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // commands
  grunt.registerTask('default', ['handlebarslayouts', 'sass', 'jshint', 'concat', 'uglify', 'connect', 'watch']);
  grunt.registerTask('serve', ['connect', 'watch']);
  grunt.registerTask('build', ['handlebarslayouts', 'sass', 'jshint', 'concat', 'uglify']);

};
