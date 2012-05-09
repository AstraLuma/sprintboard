#!/usr/bin/node
var app = require('express').createServer()
  , io = require('socket.io').listen(app)
  , valuetree = require('./valuetree.js');

var Values = new valuetree.ValueTree();

app.listen(process.env.PORT || 80);

app.get(/^(\/.*)$/, function(req, res) {
    res.sendfile(__dirname + '/static/index.html');
});

function SendCommand(name) {
    io.sockets.emit("command", name);
}

io.sockets.on('connection', function(socket) {
    function set(name, value) {
    	socket.emit('set', name, value);
    }
    function del(name) {
        socket.emit('set', name);
    }
    Values.on('set', set);
    Values.on('del', del);
    socket.on('disconnect', function() {
    	Values.removeListener('set', set);
    	Values.removeListener('del', del);
    });
});
