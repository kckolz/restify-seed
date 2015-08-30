#Restify OAuth2 Seed
A starting point for building a scalable & maintainable [Restify](http://mcavage.me/node-restify/) REST API with [Oauth2](https://tools.ietf.org/html/rfc6749) Authentication.

##About
This project builds on the [Restify-Seed](https://github.com/MatthewVita/Restify-Seed) project by adding [restify-oauth2](https://github.com/domenic/restify-oauth2) to provide the (client credential)[https://tools.ietf.org/html/rfc6749#section-1.3.4] OAuth2 flow out of the box.

##Guide

####_Installation_
```shell
$ npm install 
$ npm i -g mocha 
$ node app.js --development
```
####_Testing_
See ```testing/userTests.js``` for example tests. To run the test suite, issue the following:

```shell
$ cd testing
$ mocha *.js
```

##License
MIT
