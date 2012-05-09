#!/usr/bin/node
var app = require('connect')()
  , io = require('socket.io').listen(app)
  , valuetree = require('./valuetree.js')
  , BackMan = require('./backends.js').Manager;

var Values = new valuetree.ValueTree();

app.use(
    require('connect').static(__dirname + '/static')
);

function SendCommand(name) {
    io.sockets.emit("command", name);
}

Values.on('set', function(name, value) {
    io.sockets.emit('set', name, value);
});

Values.on('del', function(name) {
    io.sockets.emit('del', name);
});

/*io.sockets.on('connection', function(socket) {
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
});*/

app.listen(process.env.PORT || 80);
