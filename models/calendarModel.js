var Q = require('q');
var moment = require('moment');
var logger = require('../libraries/logger').getLogger('CalendarModel');

function CalendarModel() {

  this.selectCalendarDay = function() {
    var dfd = Q.defer();

    try {
      logger.info('resolving current day');
      dfd.resolve({
        day: moment().format('dddd')
      });
    } catch (err) {
      dfd.reject('Chronos took the day off.');
    }

    return dfd.promise;
  };

  this.validateCalendarAppointment = function(dateTime, description, attendees) {
    if (!dateTime || !moment(dateTime, ['YYYY-MM-DD hh:mm'], true).isValid()) {
      return {
        error: 'Provide valid appointment date & time.'
      };
    } else if (moment(dateTime).unix() < moment().unix()) {
      return {
        error: 'Provide appointment date in the future.'
      };
    } else if (!description || description.trim() === '') {
      return {
        error: 'Provide valid appointment description.'
      };

      //in a real-life application, this list of attendees would be defined by
      //usernames/emails, looped through, and properly validated against a datastore
    } else if (!attendees || attendees.length === 0) {
      return {
        error: 'Provide appointment attendees.'
      };
    }

    return true;
  };

  this.insertCalendarAppointment = function(dateTime, description, attendees) {
    var dfd = Q.defer();

    logger.info('attempting to add validate new appointment');
    var validationStatus = this.validateCalendarAppointment(dateTime, description, attendees);

    if (validationStatus.hasOwnProperty('error')) {
      dfd.reject(validationStatus.error);
      return dfd.promise;
    }

    /*
    data persistance of some sort here...

    dataStore.insert({
      table: 'calendar'
      dateTime: dateTime,
      desc: description,
      attendees: attendees
      ...
    */

    //since this project has no opinions on the datastore, the
    //newly inserted id is mocked via:
    dfd.resolve({
      id: Math.floor((Math.random() * 100) + 1)
    });

    logger.info('added new appointment for ' + dateTime);

    return dfd.promise;
  };

}

module.exports = CalendarModel;