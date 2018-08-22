class Player {
  constructor(team, nodes, units) {
    this.team = team;
    this.controlledNodes = nodes;
    this.controlledUnits = units;
  }

  updateControlledNodes(originalOwner, newOwner) {
    if (this.team === originalOwner) {
      this.controlledNodes -= 1;
    }
    else if (this.team === newOwner) {
      this.controlledNodes += 1;
    }
  }

  updateControlledUnits(unitAmount) {
    this.controlledUnits += unitAmount;
  }

  scoreBoard(opponent) { //displays player's total armies and total nodes
    textSize(32);

    if (this.controlledUnits > opponent.controlledUnits)
    {
      text("#1 You: " + this.team + " Nodes: " + this.controlledNodes + " Units: " + this.controlledUnits, 10, 35);
      text("#2 Opponent: " + opponent.team + " Nodes: " + opponent.controlledNodes + " Units: " + opponent.controlledUnits, 10, 75);
    }
    else
    {
      fill('black');
      text("#1 Opponent: " + opponent.team + " Nodes: " + opponent.controlledNodes + " Units: " + opponent.controlledUnits, 10, 35);
      text("#2 You: " + this.team + " Nodes: " + this.controlledNodes + " Your Units: " + this.controlledUnits, 10, 75);
    }
  }
}
