const StarMap = require("./stars.js").default;

class View { 
  constructor() {
    this.starMap;
  }

  init() {
    this.starMap = new StarMap(); 
    this.starMap.init(); 
  }
}

export default View; 