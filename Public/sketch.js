var counter = 2;
var timer = 0; // timer for when new units are deployed
var bases = []; // array of nodes on map
var attacks = []; // array of current blobs attacks

var opponentLocation = null;
var opponentAttack = null;

var startGame = false;
var player;
var opponent;
var userTeam = null; // the team the user is a part of

var socket = io();

socket.on('start_game', (bool) => {
  startGame = true;
});

socket.on('member_team', (team) => {
  console.log(team);
  userTeam = team;

  player.team = team;

  if (player.team === 'Red') {
    opponent.team = 'Blue';
  }
  else {
    opponent.team = 'Red';
  }
});

socket.on('player_location_select', (locationData) => {
  console.log(locationData);
  opponentLocation = locationData;
  console.log(opponentLocation.baseLocation);
  bases[opponentLocation.baseLocation].node = Math.round(bases[opponentLocation.baseLocation].node / 2);
});

socket.on('player_attack', (attackData) => {
  console.log(attackData);
  attacks[attacks.length] = new Attack(opponentLocation.baseX, opponentLocation.baseY, attackData.endX, attackData.endY);
  attacks[attacks.length - 1].node = opponentLocation.node;
  attacks[attacks.length - 1].owner = opponentLocation.owner;
});

socket.on('game_payload', (payload) => {
  console.log(payload);

  bases[0] = new Base(payload[0].owner, 80, 378, payload[0].nodeValue);//20 pixels over for all
  bases[1] = new Base(payload[1].owner, 1400, 378, payload[0].nodeValue);
  bases[2] = new Base(payload[2].owner, 320, 138, payload[2].nodeValue);
  bases[10] = new Base(payload[10].owner, 320, 618, payload[10].nodeValue);
  bases[6] = new Base(payload[6].owner, 320, 378, payload[6].nodeValue);
  bases[3] = new Base(payload[3].owner, 600, 138, payload[3].nodeValue);
  bases[7] = new Base(payload[7].owner, 560, 378, payload[7].nodeValue);
  bases[11] = new Base(payload[11].owner, 600, 618, payload[11].nodeValue);
  bases[4] = new Base(payload[4].owner, 880, 138, payload[4].nodeValue);
  bases[8] = new Base(payload[8].owner, 920, 378, payload[8].nodeValue);
  bases[12] = new Base(payload[12].owner, 880, 618, payload[12].nodeValue);
  bases[5] = new Base(payload[5].owner, 1160, 138, payload[5].nodeValue);
  bases[9] = new Base(payload[9].owner, 1160, 378, payload[9].nodeValue);
  bases[13] = new Base(payload[13].owner, 1160, 618, payload[13].nodeValue);
});

checkIfGameOver = (bases) => {
  let gameOverRed = 0;
  let gameOverBlue = 0;

  bases.forEach((base) => {
    if (base.owner === 'Red') {
      gameOverRed++;
    }
    else if (base.owner === 'Blue') {
      gameOverBlue++;
    }
  });

  if (gameOverRed === 0 || gameOverBlue === 0) {
    return true;
  }
  return false;
}

emitOpponentLocationClick = (bases, index) => {
  let locationData = {
    baseX: bases[index].x,
    baseY: bases[index].y,
    node: Math.round(bases[index].node / 2),
    owner: bases[index].owner,
    baseNode: Math.round(bases[index].node / 2),
    baseLocation: index
  };
  socket.emit('player_location_select', locationData);
}

emitOpponentAttack = (bases, index) => {
  let attackData = {
    endX: bases[index].x,
    endY: bases[index].y
  };
  socket.emit('player_attack', attackData);
}

emitNodeValueChange = (index, nodeValue) => {
  socket.emit('update_node_value', index, nodeValue);
}

emitNodeValueReplace = (index) => {
  socket.emit('repace_node_value', index);
}

emitNodeOwnerChange = (index, owner) => {
  socket.emit('update_node_owner', index, owner);
}

function mouseClicked() { //Waits for user to click
  console.log('MouseClicked');
  for (var i = 0; i < bases.length; i++)
  {
    var temp = (sq((bases[i].y - pmouseY)) + sq((bases[i].x - pmouseX)^2));
    var d = sqrt(temp);

    if (d < 30) // user clicked in area of base
    {
        if (counter % 2 === 0)
        {
          emitOpponentLocationClick(bases, i);

          attacks[attacks.length] = new Attack(bases[i].x, bases[i].y, 1000, 1000);
          attacks[attacks.length - 1].node = Math.round(bases[i].node / 2);
          attacks[attacks.length - 1].owner = bases[i].owner;
          bases[i].node = Math.round(bases[i].node / 2);
          counter++;
          break;
        }
        else
        {
          emitOpponentAttack(bases, i);

          attacks[attacks.length - 1].endX = bases[i].x;
          attacks[attacks.length - 1].endY = bases[i].y;
          counter++;
          break;
        }
    }
  }
  if (counter === 4)
  {
    counter = 2;
  }
}

function setup() {
  createCanvas(1536, 755);

  player = new Player(userTeam, 1, 10);
  opponent = new Player(userTeam, 1, 10);
}

function draw() {
  if (userTeam !== null && startGame === true) { // only load game once user is assigned a team
    var add = 0;
    background(51);
    textSize(32);
    strokeWeight(4);

    player.scoreBoard(opponent);

    for (var i = 0; i < 3; i++)//draws the lines to connect the nodes
    {
      bases[0].draw(bases[2 + add].x, bases[2 + add].y);
      bases[1].draw(bases[5 + add].x, bases[5 + add].y);

      if (i === 0)
      {
        bases[6].draw(bases[7].x, bases[7].y);
        bases[8].draw(bases[9].x, bases[9].y);
        bases[3].draw(bases[4].x, bases[4].y);
        bases[11].draw(bases[12].x, bases[12].y);
      }

      if (i < 2)
      {
        bases[2].draw(bases[3 + add].x, bases[3 + add].y);
        bases[5].draw(bases[4 + add].x, bases[4 + add].y);
        bases[10].draw(bases[7 + add].x, bases[7 + add].y);
        bases[13].draw(bases[8 + add].x, bases[8 + add].y);
      }
      add += 4;
    }

    for (var i = 0; i < bases.length; i++)//draws the nodes to the screen
    {
      bases[i].updateNodeValue(player, opponent);
      bases[i].show();
    }

    for (var i = 0; i < attacks.length; i++)
    {
      if (attacks[i].endX === 1000)
      {
        console.log('Where is my destination');
        break;
      }
      else
      {
        console.log(attacks);

        attacks[i].display();
        attacks[i].move();
      }
    }

    for (var i = 0; i < attacks.length; i++)
    {
      if (attacks[i].endX === attacks[i].startX && attacks[i].endY === attacks[i].startY)
      {
        for (var j = 0; j < bases.length; j++)//find the base that matches the end goal
        {
          if (attacks[i].endX === bases[j].x && attacks[i].endY === bases[j].y)//check if attacking blob has met node
          {
            break;
          }
        }

        if (attacks[i].owner === bases[j].owner)
        {
          bases[j].node += attacks[i].node;
          //emitNodeValueChange(j, attacks[i].node);
        }
        else
        {
          if (attacks[i].owner === player.team) {
            player.updateControlledUnits(-(attacks[i].node));

            if (bases[j].owner === opponent.team) {
              opponent.updateControlledUnits(-(attacks[i].node));
            }
          }
          else if (attacks[i].owner === opponent.team) {
            opponent.updateControlledUnits(-(attacks[i].node));

            if (bases[j].owner === player.team) {
              player.updateControlledUnits(-(attacks[i].node));
            }
          }
          bases[j].node -= attacks[i].node;
          //emitNodeValueChange(j, -(attacks[i].node));
        }

        if (bases[j].node < 0)//check if the node has been taken over
        {
          bases[j].node *= -1;
          //emitNodeValueReplace(j);

          if (bases[j].node > 0)
          {
            player.updateControlledNodes(bases[j].owner, attacks[i].owner);
            opponent.updateControlledNodes(bases[j].owner, attacks[i].owner);

            // update player that was attacked
            if (bases[j].owner === player.team) {
              player.updateControlledUnits(bases[j].node);
            }
            else if (bases[j].owner === opponent.team) {
              opponent.updateControlledUnits(bases[j].node);
            }

            bases[j].owner = attacks[i].owner;

            // update player that attacked
            if (bases[j].owner === player.team) {
              player.updateControlledUnits(bases[j].node);
            }
            else if (bases[j].owner === opponent.team) {
              opponent.updateControlledUnits(bases[j].node);
            }
            //emitNodeOwnerChange(j, attacks[i].owner);
          }
        }
        attacks.splice(i, 1);//delete attacking blob
      }
    }

    player.scoreBoard(opponent);

    var gameOver = checkIfGameOver(bases);

    if (gameOver) {
      console.log('Game is Over');
    }

    timer++;
  }
}
