//---LOAD REQUIRED MODULES
var express = require('express');
var fs = require('fs');
var useragent = require('express-useragent');
var port = process.env.PORT || 8089;
//---LOAD SETTINGS
var MODE = port != 8089 ? '' : 'debug';

//---LOAD EXPRESS
app = express();
app.configure(function () {
    app.use(express.bodyParser());
    app.use(useragent.express());
    app.disable('x-powered-by');
    app.use('', express.static(__dirname));
    app.use('/css', express.static(__dirname + '/css'));
    app.use('/img', express.static(__dirname + '/img'));
    app.use('/templates', express.static(__dirname + '/templates'));
    app.use('/js', express.static(__dirname + '/js'));

    // Admin
    app.use('/admin', express.static(__dirname + '/admin'));
});

//--PAGE ROUTES
app.get('/home', function(req, res) {
    res.send(200, fs.readFileSync(__dirname + '/index.html').toString());
});

app.get('/join', function(req, res) {
    res.send(200, fs.readFileSync(__dirname + '/index.html').toString() + '#/join');
});

app.get('/schedule', function(req, res) {
    res.send(200, fs.readFileSync(__dirname + '/index.html').toString() + '#/schedule');
});

app.get('/wfm-admin', function(req, res) {
    res.send(200, fs.readFileSync(__dirname + '/admin/index.html').toString());
});

app.get('/wfm-admin/*', function(req, res) {
    res.send(200, fs.readFileSync(__dirname + '/admin/index.html').toString());
});

app.get('*', function (req, res) {
    res.redirect('/home')
});

//---START THE APP ON PORT 80
app.listen(port);