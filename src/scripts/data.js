const starData = require('../../dist/assets/filteredStars.json');
const psc = [5742,5586,6193,5742,7097,8198,9487,8833,7884,7007,4906,3786,118268,116771,116771,115830,114971,115738,116928];
const ari = [13209,9884,8903,8832]
// consider refactoring into one class :/
function getXYZ() { 
  const xyz = []; 
  for(let i=0;i<starData.length;i++){
    xyz.push(starData[i]["X"]);
    xyz.push(starData[i]["Y"]);
    xyz.push(starData[i]["Z"]);
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

export {starData, getXYZ, getLinePoints, psc, ari}