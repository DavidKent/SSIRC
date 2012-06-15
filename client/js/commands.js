function parseOutput(u) {
    var reg = /[\/]([\w]+)[\s]?([\w]*)/g;
    var match = reg.exec(u);
    if(match) {
        evaluateCommand(match[1], match[2]);
        return true;
    } 
    return false;
}

function evaluateCommand(command, arg) {
    switch(command.toLowerCase()) {
        case "help":
            appendMessage('SYSTEM', 'Commands Available:');
            appendMessage('SYSTEM', '/setName NEWNAME - will change your online alias');
            appendMessage('SYSTEM', '/setChannel CHANNELNAME - will create/join a private channel');
            appendMessage('SYSTEM', '/clear - will clear your chat window');
            appendMessage('SYSTEM', '/pm MESSAGE - will send a private message');
        break;
        case "setchannel":
            appendMessage('SYSTEM', 'Switching channels: ' + arg);
            socket.emit('channelSet', { channel: arg });
            $("#channel").html(arg);
        break;
        case "setname":
            socket.emit('userSet', { id: arg });
            $('#name').html(arg);
        break;
        case "pm":
            appendMessage('SYSTEM', 'This command is not yet implemented');
        break;
        case "clear":
            $('#chatWindow').html('');
        break;
        default:
            appendMessage('SYSTEM', '\''+command+'\' is an unknown command.');
        break;
    }
}

