    //Console Handling
    var static = require('node-static'),
    handling = require('./utils/error_h.js'),
    cons = require('./utils/console.js'),
    hook = require('./utils/key_hook.js'),
    stat = require('./utils/stat_print.js'),
    com = require('./utils/commands.js');
    
    //App Handling
    var app = require('http').createServer(handler),
    files = new(static.Server)('./client'),
    io = require('socket.io').listen(app);
    
    //Packet Handling
    var packetLib = require('./packetLib/packets.js');
    
    io.set('log level', 1);
    
    
    //Handle request
    function handler(request, response) {
        request.addListener('end', function () {
                files.serve(request, response);
                if(require('url').parse(request.url).pathname.indexOf("index") != -1) {
                    stat.incrementConnections();
                }
            });
    }
    
    //Handle Packets
    io.sockets.on('connection', function (socket) {
        packetLib.handlePackets(socket, io);
    });
    
    //Start listening
    app.listen(2000);
    console.log("Now listening on port 2000");
    
    //Pull io for referencing in packets
    exports.getSocketIO = function() {
        return io;
    }