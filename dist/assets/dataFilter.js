const fs = require('fs');
const starData = require('./starData.json');
const constellations = require('./constellations.json');
const HIP = []; 
const HD = []; 
const filteredData = []; 

for(let i = 0; i < constellations.length; i++) {
  if(constellations[i]["HIP"]){
    HIP.push(constellations[i]["HIP"]);
  }
}

for(let i = 0; i < constellations.length; i++) {
  if(constellations[i]["HD"]){
    HD.push(constellations[i]["HD"]);
  }
}

// 119618

for(let i=0; i<119618;i++){
  let starHIP = parseInt(starData[i]["HIP"]);
  let starHD = parseInt(starData[i]["HD"]);
  let star = starData[i];

  if(starHIP === 3786) {
    console.log(star)
  }
  
}



// const data = JSON.stringify(filteredData);

// write JSON string to a file
// fs.writeFile('filteredStars.json', data, (err) => {
//     if (err) {
//         throw err;
//     }
//     console.log("JSON data is saved.");
// });