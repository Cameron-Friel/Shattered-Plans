class Attack {
  constructor(clickX, clickY, destX, destY) {
    this.startX = clickX;
    this.startY = clickY;
    this.endX = destX;
    this.endY = destY;
    this.diameter = 50; // value of node size

    this.node = 0;
    this.owner = 'green'; // value
  }

  move() {
    if (this.startX > this.endX)
    {
      if (this.startY === this.endY)
      {
        console.log('straight left');
        this.startX -= 1;
      }
      else if (this.startY > this.endY)
      {
        console.log('up left');
        this.startX -= 1;
        this.startY -= 1;
      }
      else
      {
          if (this.startY < this.endY)
          {
            console.log('something');
            this.startX -= 1;
            this.startY += 1;
          }
      }
    }
    else
    {
        if (this.startY === this.endY)
        {
          console.log('straight right');
          this.startX += 1;
        }
        else if(this.startY > this.endY)
        {
          console.log('left up');
          this.startX += 1;
          this.startY -= 1;
        }
        else
        {
          console.log('left down');
          this.startX += 1;
          this.startY += 1;
        }
    }
  }

  display() {
    fill(this.owner);
    ellipse(this.startX, this.startY, this.diameter, this.diameter);
    fill('black');
    text(this.node, this.startX - 15, this.startY + 15);
  }
}
