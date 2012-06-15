    var socket = io.connect('http://localhost:2000/');
    var clientID = null;
    
    $(document).ready(function(){
        $('#chatOut').keydown(chatOut_onKeyDown);
    });
    
    socket.emit('channelSet', { channel: 'default' });
    
    socket.on('newMessage', function(data) {
        appendMessage(data.id, data.message);
    });
    
    socket.on('updateClientList', function(data) {
        var html = '';
        for(var i = 0; i < data.list.length; i ++) {
            html += data.list[i] + '<br>';
        }
        $('#userList').html(html);
    });
    
    function chatOut_onKeyDown(e) {
        if(e.keyCode == 13) {
            var value = $('#chatOut').val();
            $('#chatOut').val('');
            if(parseOutput(value)) return;
            socket.emit('sendMessage', {message: value});
        }
    }
    
    function parseMessage(msg) {
        var cursor = 0;
        var msgd = '';
        for(var i = 0; i < msg.length; i++) {
            msgd += msg[i];
            if(cursor == 30) {
                msgd += "<br>"; 
                cursor = 0;
            }
            cursor++;
        }
        return msgd;
    } 
    
    function appendMessage(id, message) {
        var chatWin = $("#chatWindow");
        var html = chatWin.html();
        html +=  "<br>" + "<span ";
        html +=" class='user'>[";
        html += id;
        html += "]</span>";
        html += " " + message;
        chatWin.html(html);
        chatWin.animate({ scrollTop: chatWin.prop("scrollHeight") - chatWin.height() }, 60);
    }