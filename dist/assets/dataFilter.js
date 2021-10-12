const starData = require('./starData.json');
const piscesHIP = [9487,113889,114971,3786,4906,5737,5743,7097,115830,116771,115738,116928,7007,7884,8833,8198,7535,6706,4889,5586,6193,5742,5571,5131,5132,5310,5454,118268]
const pisces = []
const geminiHIP = [37826,36850,31681,30343,32246,29655,32362,35550,37740,35350,33018,36046,34088,36962,30883,28734,36366,37629,34693,32249,33202,37265,37908,39424,38538]
const gemini = []

for(let i = 0; i < 119618; i++){
  if(piscesHIP.includes(parseInt(starData[i]["HIP"]))) {
    const x = starData[i]["X"];
    const y = starData[i]["Y"];
    const z = starData[i]["Z"];
    pisces.push([x,y,z]);
  }else if(geminiHIP.includes(parseInt(starData[i]["HIP"]))) {
    const x = starData[i]["X"];
    const y = starData[i]["Y"];
    const z = starData[i]["Z"];
    gemini.push([x,y,z]);
  }
}

console.log(pisces);
console.log(gemini);
// console.log(pisces.length)