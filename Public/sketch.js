var song;
var socket;
var counter = 2;
var counter1 = 2;
var timer = 0;//timer for when new units are deployed
var bases = [];//array of nodes on map
var attacks = [];//array of current blobs attacks

var opponentLocation = null;
var opponentAttack = null;

var player;
var userTeam; // the team the user is a part of

var socket = io();

socket.on('member_team', (team) => {
  userTeam = team;
});

socket.on('player_location_select', (locationData) => {
  console.log(locationData);
  opponentLocation = locationData;
  console.log(opponentLocation.baseLocation);
  bases[opponentLocation.baseLocation].node = Math.round(bases[opponentLocation.baseLocation].node / 2);
});

socket.on('player_attack', (attackData) => {
  console.log(attackData);

  attacks[attacks.length] = new Attack(opponentLocation.baseX, opponentLocation.baseY, 1000, 1000);
  attacks[attacks.length - 1].node = opponentLocation.node;
  attacks[attacks.length - 1].owner = opponentLocation.owner;

  attacks[attacks.length - 1].endX = attackData.endX;
  attacks[attacks.length - 1].endY = attackData.endY;
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

function mouseClicked() { //Waits for user to click
  console.log('MouseClicked');
  for (var i = 0; i < bases.length; i++)
  {
    var temp = (sq((bases[i].y - pmouseY)) + sq((bases[i].x - pmouseX)^2));
    var d = sqrt(temp);//pmouseX * pmouseY + bases[i].x * bases[i].y;//var d = p5.Vector.dist(pmouseX * pmouseY * 20^2, bases[i].x * bases[i].y * 60^2);

    if (d < 30)// bases[i].diameter / 2 + 20;
    {
        if (counter % 2 === 0)
        {
          let locationData = {
            baseX: bases[i].x,
            baseY: bases[i].y,
            node: Math.round(bases[i].node / 2),
            owner: bases[i].owner,
            baseNode: Math.round(bases[i].node / 2),
            baseLocation: i
          };
          socket.emit('player_location_select', locationData);

          attacks[attacks.length] = new Attack(bases[i].x, bases[i].y, 1000, 1000);
          attacks[attacks.length - 1].node = Math.round(bases[i].node / 2);
          attacks[attacks.length - 1].owner = bases[i].owner;
          bases[i].node = Math.round(bases[i].node / 2);
          counter++;
          break;
        }
        else
        {
          let attackData = {
            endX: bases[i].x,
            endY: bases[i].y
          };
          socket.emit('player_attack', attackData);

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

  bases[0] = new Base('Red', 80, 378);//20 pixels over for all
  bases[1] = new Base('Blue', 1400, 378);
  bases[2] = new Base('white', 320, 138);
  bases[10] = new Base('white', 320, 618);
  bases[6] = new Base('white', 320, 378);
  bases[3] = new Base('white', 600, 138);
  bases[7] = new Base('white', 560, 378);
  bases[11] = new Base('white', 600, 618);
  bases[4] = new Base('white', 880, 138);
  bases[8] = new Base('white', 920, 378);
  bases[12] = new Base('white', 880, 618);
  bases[5] = new Base('white', 1160, 138);
  bases[9] = new Base('white', 1160, 378);
  bases[13] = new Base('white', 1160, 618);
}

function draw() {

  var add = 0;
  background(51);
  textSize(32);
  strokeWeight(4);

  scoreBoard(player);

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
    bases[i].updateNodeValue(player);
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
      //console.log(attacks[i]);
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
      }
      else
      {
        player.updateControlledUnits(-attacks[i].node);
        bases[j].node -= attacks[i].node;
      }

      if (bases[j].node < 0)//check if the node has been taken over
      {
        bases[j].node *= -1;

        if (bases[j].node > 0)
        {
          player.updateControlledNodes(bases[j].owner, attacks[i].owner)
          bases[j].owner = attacks[i].owner;
        }
      }
      attacks.splice(i, 1);//delete attacking blob
    }
  }

  var gameOver = checkIfGameOver(bases);

  if (gameOver) {
    console.log('Game is Over');
  }

  timer++;
}
