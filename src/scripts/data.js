const starData = require('../../dist/assets/filteredStars.json');

function getXYZ() { 
  const xyz = []; 
  for(let i=0;i<starData.length;i++){
    xyz.push(starData[i]["X"]);
    xyz.push(starData[i]["Y"]);
    xyz.push(starData[i]["Z"]);
  }
  return xyz; 
}

export {starData, getXYZ}