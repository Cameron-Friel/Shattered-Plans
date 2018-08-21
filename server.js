var express = require('express');
var app = express();
var path = require('path');
let http = require('http').Server(app);
let io = require('socket.io')(http);

let gameMembers = [];

const TEAM_RED = 'Red';
const TEAM_BLUE = 'Blue';

app.use(express.static(path.join(__dirname, 'Public')));

app.get('/', (req, res) => {
  res.sendFile('index.html');
});

determineMemberTeam = (members) => {
  if (members.length === 1) {
    io.emit('member_team', TEAM_RED);
  }
  else {
    io.emit('member_team', TEAM_BLUE);
  }
}

checkGameSpace = (id) => {
  if (gameMembers.length < 2) {
    console.log('Adding user: ' + id);
    gameMembers.push(id);
    determineMemberTeam(gameMembers);
  }
  else {
    console.log('Lobby is full.');
  }
 }

 removeMemberFromGame = (id) => {
   gameMembers.forEach((member, index) => {
     if (id === member) {
       console.log('Removing user: ' + id);
       gameMembers.splice(index);
     }
   });
 }

io.on('connection', (socket) => {
  console.log(socket.id + ' connected.');
  checkGameSpace(socket.id);

  socket.on('player_location_select', (locationData) => {
    console.log(locationData);
    socket.broadcast.emit('player_location_select', locationData);
  });

  socket.on('player_attack', (attackData) =>{
    console.log(attackData);
    socket.broadcast.emit('player_attack', attackData);
  });

  socket.on('disconnect', () => {
    console.log(socket.id + ' disconnected.');
    removeMemberFromGame(socket.id);
  });
});

http.listen(3000, () => {
  console.log('Server is listening on port 3000.');
});
