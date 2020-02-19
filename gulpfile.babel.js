const env = require("./env");

const gulp = require("gulp");

// CSS related plugins.
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const purgecss = require("gulp-purgecss");

// JS related plugins.
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const babel = require("gulp-babel");

// Utility related plugins.
const browserSync = require("browser-sync").create();
const rename = require("gulp-rename");
const lineec = require("gulp-line-ending-corrector");
const filter = require("gulp-filter");
const remember = require("gulp-remember");

const browsersync = done => {
  browserSync.init({
    port: 3000,
    open: env.browserAutoOpen,
    injectChanges: env.injectChanges,
    server: {
      baseDir: env.productURL
    },
    ghostMode: {
      clicks: false,
      forms: false,
      scroll: false
    }
  });
  done();
};

const reload = done => {
  browserSync.reload();
  done();
};

gulp.task("scss-dev", () => {
  return gulp
    .src(env.styleSRC, { allowEmpty: true })
    .pipe(
      sass({
        errLogToConsole: env.errLogToConsole
      })
    )
    .on("error", sass.logError)
    .pipe(autoprefixer(env.BROWSERS_LIST))
    .pipe(rename({ suffix: ".min" }))
    .pipe(lineec())
    .pipe(gulp.dest(env.styleDestination))
    .pipe(browserSync.stream());
});

gulp.task("scss-build", () => {
  return (
    gulp
      .src(env.styleSRC, { allowEmpty: true })
      .pipe(
        sass({
          errLogToConsole: env.errLogToConsole,
          outputStyle: env.outputStyle,
          precision: env.precision
        })
      )
      .on("error", sass.logError)
      .pipe(autoprefixer(env.BROWSERS_LIST))
      .pipe(filter("**/*.css")) // Filtering stream to only css files.
      .pipe(rename({ suffix: ".min" }))
      .pipe(lineec()) // Consistent Line Endings for non UNIX systems.
      // .pipe(
      // 	purgecss({
      // 		content: [env.watchDocuments],
      // 		whitelist: env.whitelistPurgeCss
      // 	})
      // )
      .pipe(gulp.dest(env.styleDestination))
      .pipe(browserSync.stream())
  );
});

gulp.task("es6-dev", () => {
  return (
    gulp
      .src(env.jsVendorSRC, { since: gulp.lastRun("es6-dev") }) // Only run on changed files.
      // .pipe(plumber(errorHandler))
      .pipe(
        babel({
          presets: [
            [
              "@babel/preset-env", // Preset to compile your modern JS to ES5.
              {
                targets: { browsers: env.BROWSERS_LIST } // Target browser list to support.
              }
            ]
          ]
        })
      )
      .pipe(remember(env.jsVendorSRC)) // Bring all files back to stream.
      .pipe(concat(env.jsVendorFile + ".js"))
      .pipe(lineec()) // Consistent Line Endings for non UNIX systems.
      .pipe(gulp.dest(env.jsVendorDestination))
      .pipe(
        rename({
          basename: env.jsVendorFile,
          suffix: ".min"
        })
      )
      .pipe(uglify())
      .pipe(lineec()) // Consistent Line Endings for non UNIX systems.
      .pipe(gulp.dest(env.jsVendorDestination))
  );
});

gulp.task("es6-build", () => {
  return (
    gulp
      .src(env.jsVendorSRC, { since: gulp.lastRun("es6-build") }) // Only run on changed files.
      // .pipe(plumber(errorHandler))
      .pipe(
        babel({
          presets: [
            [
              "@babel/preset-env", // Preset to compile your modern JS to ES5.
              {
                targets: { browsers: env.BROWSERS_LIST } // Target browser list to support.
              }
            ]
          ]
        })
      )
      .pipe(remember(env.jsVendorSRC)) // Bring all files back to stream.
      .pipe(concat(env.jsVendorFile + ".js"))
      .pipe(lineec()) // Consistent Line Endings for non UNIX systems.
      .pipe(gulp.dest(env.jsVendorDestination))
      .pipe(
        rename({
          basename: env.jsVendorFile,
          suffix: ".min"
        })
      )
      .pipe(uglify())
      .pipe(lineec()) // Consistent Line Endings for non UNIX systems.
      .pipe(gulp.dest(env.jsVendorDestination))
  );
});

gulp.task(
  "dev",
  gulp.parallel("scss-dev", "es6-dev", browsersync, () => {
    gulp.watch(env.watchDocuments, reload);
    gulp.watch(env.watchStyles, gulp.parallel("scss-dev"));
    gulp.watch(env.watchJsVendor, gulp.series("es6-dev", reload));
  })
);

gulp.task("build", gulp.parallel("scss-build", "es6-build"));
