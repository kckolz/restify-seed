var restify = require('restify');
var config = require('../config');
var CalendarController = require('../controllers/calendarController');

var rateLimit = restify.throttle({
  burst: config.limiter.defaultBurstRate,
  rate: config.limiter.defaultRatePerSec,
  ip: true
});

function CalendarRoutes(api) {
  api.get('/api/calendar/day', rateLimit, CalendarController.getCalendarDay);

  api.post('/api/calendar/appointment', rateLimit, CalendarController.postCalendarAppointment);
}

module.exports.routes = CalendarRoutes;