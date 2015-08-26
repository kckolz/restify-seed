var CalendarModel = require('../models/calendarModel');

var CalendarController = {

  getCalendarDay: function(req, res) {
    var calModel = new CalendarModel();

    calModel.selectCalendarDay()
      .then(function(day) {
        res.send(200, day);
      })
      .catch(function(err) {
        res.send(500, {
          error: err
        });
      });
  },

  postCalendarAppointment: function(req, res) {
    var calModel = new CalendarModel();

    calModel.insertCalendarAppointment(
        req.params.dateTime,
        req.params.description,
        req.params.attendees)
      .then(function(status) {
        res.send(201, status);
      })
      .catch(function(err) {
        res.send(500, {
          error: err
        });
      });
  }
};

module.exports = CalendarController;