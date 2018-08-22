class Base {
  constructor(owner, x, y, nodeValue) {
    this.x = x;
    this.y = y;
    this.diameter = 60;
    this.node = nodeValue;
    this.owner = owner;
  }

  draw(x, y) {
    line(this.x, this.y, x, y);
  }

  show() { //fills in the nodes with their respective score and owner
    fill(this.owner);
    ellipse(this.x, this.y, this.diameter, this.diameter);
    fill('black');
    text(this.node, this.x - 15, this.y + 15);
  }

  updateNodeValue(player, opponent) {
    if (this.owner !== 'White')
    {
      if (timer % 100 === 0)
      {
        this.node += 1;

        if (player.team === this.owner) {
          player.updateControlledUnits(1);
        }
        else {
          opponent.updateControlledUnits(1);
        }
      }
    }
  }
}
