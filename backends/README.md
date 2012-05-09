This is where the backend modules are kept. Each one gets its own directory.

Each backend is started by the SprintBoard server process and the server is 
responsible for managing them: starting, shutting down, reloading, crash detection, etc.

Communication
-------------
The server communicates to backends using stdio. On startup, the server will 
send the backend its configuration information in JSON format over its STDIN, 
and then close the pipe.

After this initial configuration, the server will listen for tree update events 
on STDOUT. Additional logging information can be printed to STDERR; this is 
piped through to the server's logging mechanism.

TODO: What's the format for tree updates?