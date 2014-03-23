module.exports = function(grunt) {

  var jsonFiles = [
    'theme.json',
    'theme-ui.json',
    'package.json',
    'labels/*.json'
  ],
    jsFiles = [
    'gruntfile.js',
    'build.js',
    'scripts/**/*.js'
  ],
    filesToArchive = [
    'compiled/**',
    'labels/**',
    'resources/**',
    'scripts/**',
    'stylesheets/**',
    'templates/**',
    'build.js',
    'CHANGELOG.md',
    'Gruntfile.js',
    'LICENSE',
    'package.json',
    'README.md',
    'theme.json',
    'theme-ui.json',
    '*.png'
  ];

grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jsonlint: {
      theme_json: {
        src: jsonFiles
      }
    },
    jshint: {
      theme_js: jsFiles,
      options: {
        ignores: ['scripts/vendor/**/*.js'],
        undef: true,
        laxcomma: true,
        unused: false,
        globals: {
          console: true,
          window: true,
          document: true,
          setTimeout: true,
          clearTimeout: true,
          module: true,
          define: true,
          require: true,
          process: true
        }
      }
    },
    zubat: {
      main: {
        dir: '.',
        manualancestry: ['../Core4'],
        ignore: ['\\.git','node_modules','^/resources','^/tasks','\\.zip$']
      }
    },
    compress: {
      build: {
        options: {
          archive: '<%= pkg.name %>.zip',
          pretty: true
        },
        files: [{
          src: filesToArchive,
          dest: '/'
        }]
      }
    },
    watch: {
      json: {
        files: jsonFiles,
        tasks: ['jsonlint']
      },
      javascript: {
        files: jsFiles,
        tasks: ['jshint']
      },
      compress: {
        files: filesToArchive,
        tasks: ['compress']
      }
    },
    setver: {
      release: {
        themejson: true,
        packagejson: true,
        readmemd: true,
        thumbnail: {
          src: 'thumb.tpt.png',
          color: '#cbcbcb',
          pointsize: 72,
          dest: 'thumb.png'
        }
      },
      build: {
        themejson: true,
        thumbnail: {
          src: 'thumb.tpt.png',
          color: '#ffffff',
          pointsize: 20,
          dest: 'thumb.png'
        }
      },
      renamezip: {
        filenames: ["<%= pkg.name %>.zip"]
      }
    }
  });

  ['grunt-jsonlint',
   'grunt-contrib-jshint',
   'grunt-contrib-watch',
   'grunt-contrib-compress'
  ].forEach(grunt.loadNpmTasks);

  grunt.loadTasks('./tasks/');

  grunt.registerTask('default', ['jsonlint', 'jshint', 'compress']);
  grunt.registerTask('build', ['jsonlint', 'jshint', 'zubat', 'setver:build', 'compress', 'setver:renamezip']);
  grunt.registerTask('release', ['jsonlint', 'jshint', 'zubat', 'setver:release', 'compress', 'setver:renamezip']);
};
