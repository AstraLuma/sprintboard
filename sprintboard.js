#!/usr/bin/node
var connect = require('connect')
  , app = connect()
  , server = app.listen(process.env.PORT || 80)
  , io = require('socket.io').listen(server)
  , valuetree = require('./valuetree.js')
  , BackMan = require('./backends.js').Manager;

var Values = new valuetree.ValueTree();

app.use(
    connect.static(__dirname + '/static')
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

