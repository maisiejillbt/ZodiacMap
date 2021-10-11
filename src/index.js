const StarMap = require("./scripts/stars.js").default;


document.addEventListener("DOMContentLoaded", () => {
  const stars = new StarMap();
  stars.init();
})