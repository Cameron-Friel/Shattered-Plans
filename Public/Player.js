function Player(team, nodes, units) {
  this.team = team;
  this.controlledNodes = nodes;
  this.controlledUnits = units;

  this.updateControlledNodes = (originalOwner, newOwner) => {
    if (this.team === originalOwner) {
      this.controlledNodes -= 1;
    }
    else if (this.team === newOwner) {
      this.controlledNodes += 1;
    }
  }

  this.updateControlledUnits = (unitAmount) => {
    this.controlledUnits += unitAmount;
  }
}
