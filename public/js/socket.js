$(document).ready(function() { 
 
    let user = localStorage.getItem('user'); 
     
     
    if(!user) return; 
     
    user = JSON.parse(user) 
     
    var socket = io("ws://localhost:5555", { query: { id: user.id }}); 

 
     
    socket.on('sendComment', function(msg) { 
        console.log(msg);
    }); 
     
    });