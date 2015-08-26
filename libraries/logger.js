var winston = require('winston');
var moment = require('moment');
var path = require('path');

module.exports = {
  getLogger: function(context) {
    return new(winston.Logger)({
      transports: [
        new winston.transports.Console({
          colorize: true,
          formatter: function(args) {
            return '[' + args.level.toUpperCase() + '] ' + moment().format() + ' - ' + args.message + ' - ' + context;
          }
        }),
        new winston.transports.File({
          filename: path.resolve(__dirname, '../app.log'),
          maxsize: 1024 * 1024 * 10
        })
      ]
    });
  }
};