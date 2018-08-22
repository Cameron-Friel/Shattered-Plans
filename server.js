var express = require('express');
var app = express();
var path = require('path');
let http = require('http').Server(app);
let io = require('socket.io')(http);

let gameMembers = [];

class Game {
  constructor() {
    this.bases =
    [{owner: 'Red', nodeValue: 10},
    {owner: 'Blue', nodeValue: 10},
    {owner: 'White', nodeValue: 10},
    {owner: 'White', nodeValue: 10},
    {owner: 'White', nodeValue: 10},
    {owner: 'White', nodeValue: 10},
    {owner: 'White', nodeValue: 10},
    {owner: 'White', nodeValue: 10},
    {owner: 'White', nodeValue: 10},
    {owner: 'White', nodeValue: 10},
    {owner: 'White', nodeValue: 10},
    {owner: 'White', nodeValue: 10},
    {owner: 'White', nodeValue: 10},
    {owner: 'White', nodeValue: 10}];
  }

  /**
    * Updates the value of a given node
    * @param {int} index - The index of the node to be updated
    * @param {int} nodeValue - The new value in the node
  **/

  updateNodeValue(index, nodeValue) {
    console.log('Value: ' + nodeValue);
    this.bases[index].nodeValue += nodeValue;
    console.log(this.bases[index]);
  }

  replaceNodeValue(index) {
    this.bases[index].nodeValue *= -1;
  }

  updateNodeOwner(index, owner) {
    this.bases[index].owner = owner;
  }
}

let game = new Game();

const TEAM_RED = 'Red';
const TEAM_BLUE = 'Blue';

app.use(express.static(path.join(__dirname, 'Public')));

app.get('/', (req, res) => {
  res.sendFile('index.html');
});

app.get('*', (req, res) => {
  res.sendFile(__dirname + '/Public' + '/404.html');
});

/**
  * Determines which to to place the user on
  * @param {array} members - The list of users in the game
  * @param {socket} socket - The connecting user's socket object
**/

sendInitialGameData = (members, socket) => {
  if (members.length === 1) {
    socket.emit('member_team', TEAM_RED);
  }
  else {
    socket.emit('member_team', TEAM_BLUE);
  }
  socket.emit('game_payload', game.bases);

  if (gameMembers.length === 2) {
    io.emit('start_game', true);
  }
}

/**
  * Checks if the game has space for a connecting user or not
  * @param {socket} socket - The connecting user's socket object
**/

checkGameSpace = (socket) => {
  if (gameMembers.length < 2) {
    console.log('Adding user: ' + socket.id);
    gameMembers.push(socket.id);
    sendInitialGameData(gameMembers, socket);
  }
  else {
    console.log('Lobby is full.');
  }
 }

 /**
   * Removes a player who disconnected from the game
   * @param {string} id - The connecting user's socket id
 **/

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
  checkGameSpace(socket);

  socket.on('player_location_select', (locationData) => {
    console.log('Start Location: ' + locationData);
    //game.updateNodeValue(locationData.baseLocation, -(locationData.node));
    socket.broadcast.emit('player_location_select', locationData);
  });

  socket.on('player_attack', (attackData) =>{
    console.log('Attack destination: ' + attackData);
    socket.broadcast.emit('player_attack', attackData);
  });

  socket.on('update_node_value', (index, nodeValue) => {
    game.updateNodeValue(index, nodeValue);
  });

  socket.on('replace_node_value', (index) => {
    game.replaceNodeValue(index);
  });

  socket.on('update_node_owner', (index, owner) => {
    game.updateNodeOwner(index, owner);
  });

  socket.on('disconnect', () => {
    console.log(socket.id + ' disconnected.');
    removeMemberFromGame(socket.id);
  });
});

http.listen(3000, () => {
  console.log('Server is listening on port 3000.');
});
