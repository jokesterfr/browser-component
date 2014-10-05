/**
 * @author Clément Désiles <clement.desiles@telecomsante.com>
 * @date 2014-09-09
 * @see http://gruntjs.com/getting-started
 * @see https://github.com/blueimp/grunt-locales
 * Grunt task manager descriptor
 */
module.exports = function(grunt) {

  // Project configuration
  grunt.initConfig({
    svgmin: {
      dist: {
        expand: true,
        cwd: 'img/src',
        src: ['*.svg'],
        dest: 'img/',
        ext: '.svg'
      }
    },

    dataUri: {
      dist: {
        src: ['dist/browser-component.html'],
        dest: 'dist',
        options: {
          target: ['img/*.*']
        }
      }
    },

    vulcanize: {
      options: { csp: true },
      default: {
        files: {
          'dist/browser-component.html': 'lib/browser-component.html'
        },
      },
    },

    watch: {
      svg: {
        files: ['img/src/*.svg'],
        tasks: ['svgmin'],
        options: {
          spawn: false,
        },
      },
      components: {
        files: ['lib/*'],
        tasks: ['vulcanize', 'dataUri'],
        options: {
          spawn: false,
        }
      }
    }
  });

  // Load grunt plugins
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-vulcanize');
  grunt.loadNpmTasks('grunt-data-uri');
  grunt.loadNpmTasks('grunt-svgmin');

  // Default task(s).
  grunt.registerTask('default', ['vulcanize', 'svgmin', 'dataUri']);
};