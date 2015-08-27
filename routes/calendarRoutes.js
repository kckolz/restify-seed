var CalendarController = require('../controllers/calendarController');

function CalendarRoutes(api) {
  api.get('/api/calendar/day', CalendarController.getCalendarDay);

  api.post('/api/calendar/appointment', CalendarController.postCalendarAppointment);
}

module.exports.routes = CalendarRoutes;