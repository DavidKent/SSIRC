var channels = {};
var sys = "SYSTEM";

exports.handlePackets = function(socket, io) {
    socket.on('channelSet', function(data) {
        if(socket.channel != undefined)
            sendDisconnect(socket);
        socket.channel = data.channel;
        if(channels[data.channel] === undefined)
            channels[data.channel] = {};
        var ch = channels[data.channel];
        if(ch.clients === undefined) 
            ch.clients = [];
        channels[data.channel].clients.push(socket);
        var clientCount = ch.clients.length;
        var newID = '';
    
        if(socket.uid === undefined) {
            newID = 'User' + clientCount;
            socket.uid = newID;
        } else {
            newID = socket.uid;
        }
        sendMessageToClients(data.channel, sys, newID + ' has entered the channel.');
        sendClientListUpdate(data.channel);
    });
    
    socket.on('disconnect', function(data) {
        sendDisconnect(socket);
    });
    
    socket.on('userSet', function(data) {
        sendMessageToClients(socket.channel, sys, socket.uid + ' changed his name to ' + data.id + '.');
        socket.uid = data.id;
        sendClientListUpdate(socket.channel); 
    });
    
    socket.on('sendMessage', function(data) {
        sendMessageToClients(socket.channel, socket.uid, data.message);
    });
}

function sendMessageToClients(channel, id, message) {
    var c = channels[channel];
    for(var i = 0; i < c.clients.length; i++) {
        c.clients[i].emit('newMessage', {id: id, message: message });
    }
}

function sendClientListUpdate(channel) {
    var c = channels[channel];
    var users = [];
    for(var i = 0; i < c.clients.length; i++) {
        users.push(c.clients[i].uid);
    }
    for(socket in c.clients) {
        c.clients[socket].emit('updateClientList', {list: users});
    }
}

function sendDisconnect(socket) {
    if(channels[socket.channel] === undefined) return;
    if(channels[socket.channel].clients.length === 1)
        channels[socket.channel].clients = [];
    else
        channels[socket.channel].clients = channels[socket.channel].clients.splice(socket, 1);
    sendMessageToClients(socket.channel, sys, socket.uid + ' has left the channel.'); 
    sendClientListUpdate(socket.channel);
}
