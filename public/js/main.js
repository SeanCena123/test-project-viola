var socket = io.connect({secure: true}); 
socket.emit('connections', 'value');