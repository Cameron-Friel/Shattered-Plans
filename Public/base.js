function Base(value, x, y) {

  this.x = x//random(40, 1536 - 40);
  this.y = y//random(40, 755 - 40);
  this.diameter = 60;
  this.node = 10;
  this.owner = value;

  this.draw = function(x, y) {
    line(this.x, this.y, x, y);
  }

  this.show = function() { //fills in the nodes with their respective score and owner
    fill(this.owner);
    ellipse(this.x, this.y, this.diameter, this.diameter);
    fill('black');
    text(this.node, this.x - 15, this.y + 15);
  }

  this.updateNodeValue = (player) => {
    if (this.owner !== 'white')
    {
      if (timer % 100 === 0)
      {
        this.node += 1;

        if (player.team === this.owner) {
          player.updateControlledUnits(1);
        }
      }
    }
  }

  scoreBoard = (player) => { //displays player's total armies and total nodes
    textSize(32);

    if (true === true)
    {
      text("#1 You: " + player.team + " Nodes: " + player.controlledNodes + " Your Units: " + player.controlledUnits, 10, 35);
      text("#2 Opponent: " + " Nodes: ", 10, 75);
    }
    else
    {
      fill('black');
      text("#1 Opponent: " + " Nodes: ", 10, 35);
      text("#2 You: " + player.team + " Nodes: " + player.controlledNodes + " Your Units: " + player.controlledUnits, 10, 75);
    }
  }
}
