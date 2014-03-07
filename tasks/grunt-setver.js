'use strict';
module.exports = function(grunt) {
  grunt.registerMultiTask('setver', 'Update all version information.', function() {
    var execSync = require('exec-sync');
    var newver = grunt.option('to') || execSync('git describe --tags');
    var async = require('async');
    var fs = require('fs');
    var path = require('path');
    if (!newver) {
      grunt.log.error('No version supplied.');
      return done(false);
    }
    grunt.log.writeln('Updating everything to version ' + newver);

    var spawn = require('child_process').spawn,
      child,
      self = this,
      done = this.async(),
      next = function(cb) {
        process.nextTick(function() {
          cb(null, true);
        });
      },
      tasks = {
      packagejson: function(cb) {
        var pkg = grunt.file.readJSON('package.json');
        pkg.version = newver;
        grunt.file.write('package.json',JSON.stringify(pkg, null, 2));
        grunt.log.ok('Updated package.json version to ' + newver);
        next(cb);
      },
      themejson: function(cb) {
        var themejson = grunt.file.readJSON('theme.json');
        themejson.about.version = newver;
        var newName = themejson.about.name.split('v');
        newName.pop();
        newName.push(newver);
        themejson.about.name = newName.join('v');
        grunt.file.write('theme.json',JSON.stringify(themejson, null, 2));
        grunt.log.ok('Updated theme.json version to ' + newver);
        next(cb);
      },
      readmemd: function(cb) {
        var readmetxt = grunt.file.read('README.md');
        grunt.file.write('README.md', readmetxt.replace(/\nVersion:.*\n/, "\nVersion: " + newver + "\n"));
        grunt.log.ok('Updated readme.md version to ' + newver);
        next(cb);
      },
      thumbnail: function(cb) {
        child = spawn('convert',[
                  'thumb.png.tpt',
                  '-gravity',self.data.gravity || 'southeast',
                  '-font',self.data.font || 'AvantGarde-Demi',
                  '-pointsize',self.data.pointsize || 18,
                  '-fill',self.data.color || 'black',
                  '-annotate',0,
                  newver,'thumb.png']);
        child.stderr.on('data', function(data) {
          grunt.log.error(data);
          cb(data);
        });

        child.on('close', function(code) {
          if (code) {
            grunt.log.error('Thumbnail update failed.');
            cb(code);
          } else {
            grunt.log.ok('Updated thumbnail version to ' + newver);
            cb(null,true);
          }
        });
      },
      filenames: function(cb) {
        if (!Array.isArray(self.data.filenames)) {
          var err = 'Please supply an array of filenames to rename with the version, instead of "' + filenames + '".';
          grunt.log.error(err);
          return cb(err);
        }
        var suffix = '-' + newver;
        self.data.filenames.forEach(function(filename) {
          var ext = path.extname(filename),
            newName = path.basename(filename, ext) + suffix + ext;
          fs.renameSync(filename, newName);
          grunt.log.ok('Updated ' + filename + ' to ' + newName);
        });
        next(cb);
      }
    };

    var toRun = {};
    for (var task in tasks) {
      if (this.data[task]) {
        toRun[task] = tasks[task];
      }
    }

    async.parallel(toRun, function(err, allDone) {
      if (err) {
        grunt.fail.fatal(err);
      } else {
        done(true);
      }
    });

  });
};