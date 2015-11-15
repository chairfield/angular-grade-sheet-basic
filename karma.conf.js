module.exports = function (config) {
  'use strict';
  config.set({
    basePath: '',

    frameworks: ['jasmine'],

    files: [
        'js/angular.js',
        'js/angular-local-storage.js',
        'js/grade-sheet.js',
        'node_modules/angular-mocks/angular-mocks.js',
        'spec/*.spec.js'
    ],

    reporters: ['story'],

    port: 9876,
    colors: true,
    autoWatch: true,
    singleRun: false,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // If you are having trouble finding PhantomJS (i.e., it's asking you to set the PHANTOMJS_BIN env var), note that
    // the right place is in the Environment Variables control in the Webstorm Edit Configuration view.
    browsers: ['PhantomJS']
  });
};
