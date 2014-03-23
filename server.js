var express = require('express'),
  routes = require('./routes'),
  http = require('http'),
  path = require('path');

var basepath = '/scenario';

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3001);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded());
  app.use(express.methodOverride());
  app.use(express.cookieParser('ft3x7Ap2sSd5rcAKoM3L'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get(basepath + '/', routes.index);

app.get(basepath + '/uberadmin', routes.uberadmin);

app.get(basepath + '/:projectid', routes.scenario);

app.get(basepath + '/:projectid/:scenarioid', routes.scenario);

app.get(basepath + '/:projectid/admin', routes.admin);

app.post(basepath + '/imgupload', routes.imgupload);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
