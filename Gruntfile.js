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
    dataUri: {
      dist: {
        src: ['dist/browser-component.html'],
        dest: 'dist',
        options: {
          target: ['icons/*.*']
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

  // Default task(s).
  grunt.registerTask('default', ['vulcanize', 'dataUri']);
};