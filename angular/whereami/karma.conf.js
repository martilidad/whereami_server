// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-firefox-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      jasmine: {
        // you can add configuration options for Jasmine here
        // the possible options are listed at https://jasmine.github.io/api/edge/Configuration.html
        // for example, you can disable the random execution with `random: false`
        // or set a specific seed with `seed: 4321`
        random: false
      },
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    jasmineHtmlReporter: {
      suppressAll: true // removes the duplicated traces
    },
    coverageReporter: {
      check: {
        emitWarning: false,
        global: {
          statements: 40,
          // branches: 50, not enabled for now
          functions: 33,
          lines: 40,
          excludes: [
            'src\app\app.module.ts',
            'src\app\app-routing.module.ts'
          ]
        },
        // each: { not enabled for now
        //   statements: 1,
        //   branches: 50,
        //   functions: 33,
        //   lines: 33,
        //   excludes: [
        //     'src\app\app.module.ts',
        //     'src\app\app-routing.module.ts'
        //   ]
        // }
      },
      dir: require('path').join(__dirname, './coverage/whereami'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' },
        { type: 'lcov'} //see "coverage gutters" vsc plugin
      ]
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
    customLaunchers: {
      ChromeDebug: {
        base: 'Chrome',
        flags: [ '--remote-debugging-port=9333' ]
      }
    },
    restartOnFileChange: true
  });
};
