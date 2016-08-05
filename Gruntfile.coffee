module.exports = (grunt) ->
  grunt_config =
    pkg: grunt.file.readJSON 'package.json'

    browserify:
      www:
        src: 'www/js/app.js'
        dest: 'www/bundle.js'
      options:
        transform: ['require-globify', 'envify']

    clean:
      all: ['www/bundle.js']

    jade:
      options:
        pretty: true
      directives:
        expand: true
        cwd: 'www'
        src: '**/*.jade'
        dest: 'www'
        ext: '.html'

    stylus:
      compile:
        files:
          'www/css/style.css': 'www/css/style.styl'

  # -----------------------------------

  grunt.registerTask 'default', [
    'clean:*'
    'browserify:*'
    'jade:*'
    'stylus:*'
  ]

  # -----------------------------------

  grunt.initConfig grunt_config
  grunt.loadNpmTasks mod for mod in [
    'grunt-browserify'
    'grunt-contrib-clean'
    'grunt-contrib-jade'
    'grunt-contrib-stylus'
  ]
