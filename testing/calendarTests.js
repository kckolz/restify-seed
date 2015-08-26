var expect = require('chai').expect;
var sinon = require('sinon');
var proxyquire = require('proxyquire');

describe('Calendar Tests', function() {
  var testUnit;

  var loggerMock;

  var goodDateTime = '2020-01-01 01:01';
  var goodDescription = 'test desc';
  var goodAttendees = [{
    id: 1
  }, {
    id: 2
  }];

  beforeEach(function() {
    loggerMock = sinon.mock({
      getLogger: function() {
        return {
          info: function() {
            return;
          }
        };
      }
    });

    testUnit = proxyquire('../models/calendarModel', {
      '../libraries/logger': loggerMock.object
    });
  });

  describe('selectCalendarDay function', function() {
    it('returns current day of the week', function() {
      var out = '';

      new testUnit().selectCalendarDay()
        .then(function(day) {
          out = day;
        })
        .finally(function() {
          expect(out.toString()).to.equal({
            day: moment().format('dddd')
          }.toString());
        });
    });
  });

  describe('validateCalendarAppointment function', function() {
    var u;

    beforeEach(function() {
      u = new testUnit();
    });

    it('errors because datetime is invalid', function() {
      var res = u.validateCalendarAppointment(null);

      expect(res).to.have.property('error');
      expect(res.error).to.equal('Provide valid appointment date & time.');
    });

    it('errors because date is in the past', function() {
      var res = u.validateCalendarAppointment('1337-02-02 02:02');

      expect(res).to.have.property('error');
      expect(res.error).to.equal('Provide appointment date in the future.');
    });

    it('errors because description must be specified', function() {
      var res = u.validateCalendarAppointment(goodDateTime, null);

      expect(res).to.have.property('error');
      expect(res.error).to.equal('Provide valid appointment description.');
    });

    it('errors because attendees must be specified', function() {
      var res = u.validateCalendarAppointment(goodDateTime, goodDescription, []);

      expect(res).to.have.property('error');
      expect(res.error).to.equal('Provide appointment attendees.');
    });

    it('validates', function() {
      var res = u.validateCalendarAppointment(goodDateTime, goodDescription, goodAttendees);

      expect(res).to.equal(true);
    });
  });

  describe('insertCalendarAppointment function', function() {
    var u;

    beforeEach(function() {
      u = new testUnit();
    });

    it('adds a new appointment', function() {
      var out = '';

      u.insertCalendarAppointment(goodDateTime, goodDescription, goodAttendees)
        .then(function(status) {
          out = status;
        })
        .finally(function() {
          expect(out).to.have.property('id');
        });
    });

    it('errors because validation wasn\'t passed', function() {
      var out = '';

      u.insertCalendarAppointment()
        .catch(function(status) {
          out = status;
        })
        .finally(function() {
          expect(out.indexOf('Provide')).to.equal(1);
          expect(out).to.not.have.property('id');
        });
    });
  });
});