cryptic-theme
=============

Esoteric, occult example theme for Mozu.

build tooling requirements
--------------------------

This theme comes with a great set of build tools. To use them, here's what you need.

* NodeJS > 0.10.0 (for JS compression and the whole build process)
* Grunt-CLI
* Java 1.7 (eventually, MozuDevClient isn't yet integrated)
* ImageMagick (for thumbnail versioning)
* GhostScript (for thumbnail versioning)

getting started
---------------

Clone or unzip this repo into a directory named after your theme (e.g. `cryptic-theme/`). Download a copy of the Core4 (Mozu Base Blank) theme and place it in a sibling directory. Your working themes directory (perhaps called `themes/`?) should look like this:
```bash
  $ ls -l
  total 0
  drwxr-xr-x@ 13 theme_developer  staff              442 Mar  6 11:34 Core4
  drwxr-xr-x  14 theme_developer  staff              476 Mar  7 14:39 cryptic-theme
```

If you want to use the build tools (and you very do), run the following:
```bash
  $ npm install -g grunt-cli
```
The global GruntJS command line client should install from Node Package Manager. Then, install the local dependencies specified in `package.json`:
```bash
  $ npm install
```

Local dependencies should all install. You can now use Grunt to lint, compile, and zip your theme!

### simple build without JS compression (for quick tests)
```bash
$ grunt
```

### build with JS compression and commit tag
```bash
$ grunt build
```

### build and update all resources to a new version number
```bash
$ grunt release --to <version>
```