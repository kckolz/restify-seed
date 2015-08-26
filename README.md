#Restify Seed
A starting point for building a scalable & maintainable [Restify](http://mcavage.me/node-restify/) REST API.

![badge](https://codeship.com/projects/063d1750-2391-0133-4c96-3eb60f8459a5/status?branch=master)

##About
Implementing a sensible abstraction, Restify Seed allows developers to stand up a solid Restify project in minutes. The architectural principles and dependencies behind Restify Seed encourage a proper separation of concerns, usage of modern design patterns, a testable codebase, and more.

##Guide

####_Installation_
```shell
# as root...
$ mkdir my-cool-project \
&& cd my-cool-project/ \
&& git clone https://github.com/MatthewVita/Restify-Seed.git \
&& rm -rf Restify-Seed/.git \
&& mv -f Restify-Seed/** ./ \
&& rm -rf Restify-Seed \
&& npm i \
&& npm i -g mocha \
&& clear \
&& node app.js --development
[INFO] 2015-06-22T20:00:30-04:00 - Calendar App is running at http://0.0.0.0:1337 - app
```

...then open up browser to [localhost:1337/api/calendar/day](localhost:1337/api/calendar/day)

####_Structure_
_(TL;DR: just follow the provided "Calendar" application sample files in the project for an idea of how this seed project structures the code.)_

Restify Seed adheres to the Model-View-Controller pattern (where "Views" are simply the JSON output to be consumed by a client). Below are some example snippets of how to structure your code:

- First, define all configuration values in ```config.js``` (some defaults are provided):

```javascript
//see config.js for full example
exports.api = {
  name: 'Calendar App!',
  version: '0.0.1'
};

exports.environment = {
  name: 'development',
  port: 1337,
  salt: '', //generate one @ random.org
  //...and so on
```

- Second, add all necessary endpoints by creating a routes file in ```routes/```:

```javascript
//see routes/calendarRoutes.js for full example
function CalendarRoutes(api) {
  api.get('/api/calendar/day', rateLimit, CalendarController.getCalendarDay);

  api.post('/api/calendar/appointment', rateLimit, CalendarController.postCalendarAppointment);
  //...and so on
```

- Third, add a controller in ```controllers/```:

```javascript
//see controllers/calendarController.js for full example
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
    //...and so on
```

- Fourth, add a model in ```models/``` (note that one can put these in "services" as well, making models anemic data models):

```javascript
//see models/calendarModel.js for full example
function CalendarModel() {

  this.selectCalendarDay = function() {
    var dfd = Q.defer();

    try {
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
  //...and so on
```

####_Testing_
See ```testing/calendarTests.js``` for example tests. To run the test suite, issue the following:

```shell
$ cd testing
$ mocha *.js
  Calendar Tests
    selectCalendarDay function
      ✓ returns current day of the week
    validateCalendarAppointment function
      ✓ errors because datetime is invalid
      ✓ errors because date is in the past
      ✓ errors because description must be specified
      ✓ errors because attendees must be specified
      ✓ validates
    insertCalendarAppointment function
      ✓ adds a new appointment
      ✓ errors because validation wasn't passed

  8 passing (20ms)
```

- [Proxyquire](https://github.com/thlorenz/proxyquire) - Default dependency interceptor library.
- [Mocha](http://mochajs.org/) - Default test runner
- [Sinon](http://sinonjs.org/) - Default spies/mocks/stubs library.
- [Chai](http://chaijs.com/) - Default assertion library.

####_Promises_
[Q](https://github.com/kriskowal/q) is the default promises library.

####_Rate Limiting_
Rate limiting can be implemented via the built-in Restify throttle package. A ```HTTP 429 - Too Many Requests``` will be issued to the consumer, so adjust your web server to a notice area as needed.

- Route-based approach:

```javascript
var rateLimit = restify.throttle({
  burst: 50,
  rate: 2,
  ip: true
});

function MyRoutes(api) {
  api.get('/api/some/route', rateLimit, ...
  //..and so on
```

- Granular approach:

```javascript
function MyRoutes(api) {
  api.get('/api/some/route', restify.throttle({burst: 50,rate: 2,ip: true}), ...
  //..and so on
```

- Global approach (not recommended in most cases):

```javascript
//would be in app.js
app.use(restify.throttle({
  burst: 50,
  rate: 2,
  ip: true
});
```

####_Common Utilities_
- [Crypto](http://github.com/evanvosberg/crypto-js) - Defacto encryption library. Great for PBKDF2 password hashing.
- [Lodash](https://github.com/lodash) - Defacto functional programming library.
- [Moment](http://momentjs.com/) - Defacto date/time library.
- [Winston](https://github.com/winstonjs/winston) - Defacto logger (note wrapper library in `./libraries/logger.js`)

####_Intelligent Error Handling_
By leveraging [node domains](http://nodejs.org/api/domain.html), error handling is gracefully handled and optionally reported via the [emailjs](https://github.com/eleith/emailjs/) module (see ```config.js``` ->  ```config.environment``` to set up email logging).

##License
MIT
