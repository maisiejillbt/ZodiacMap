const starData = require('../../dist/assets/filteredStars.json');
const posData = require('../../dist/assets/cameraPos.json');
const fillerStars = require('../../dist/assets/fillerStars.json');

// consider refactoring into one class :/
function getXYZ(data) { 
  const xyz = []; 
  for(let i=0;i<data.length;i++){
    if(data[i]["X"]){
      xyz.push(data[i]["X"]);
      xyz.push(data[i]["Y"]);
      xyz.push(data[i]["Z"]);
    }
  }
  return xyz; 
}

function getLinePoints(hipNums) {
  const xyz = [];
  for(let i=0;i<starData.length;i++){
    const starHIP = parseInt(starData[i]["HIP"]);
    if(hipNums.includes(starHIP)){
      const ord = hipNums.indexOf(starHIP);
      const x = starData[i]["X"] * 100;
      const y = starData[i]["Y"] * 100;
      const z = starData[i]["Z"] * 100;
      xyz.push([x,y,z,ord])
    }
  }
  let orderedXYZ = xyz.sort((a, b) => a[3] - b[3])

  return orderedXYZ;
}

export {starData, getXYZ, getLinePoints, posData, fillerStars}