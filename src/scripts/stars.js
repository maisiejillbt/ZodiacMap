const data = require("./data.js");
const starData = data.starData

import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols'


class StarMap {
  constructor() {
    this.camera; 
    this.scene;
    this.renderer; 
    this.starsGeo;
    this.stars;
    this.controls;
    this.cameraPos;
    this.cameraRot = [-1.580169334493619, -0.6408270080483579, -1.5864731351196486];
    this.explore = false;
  }

  init() {
    this.scene = new THREE.Scene(); // creating a this.scene
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000000); //setting a this.camera 
    this.camera.position.set(-15393.047754227286, 20637.906941436537, -193.4449256040874); // setting cameras z axis position 
    this.cameraPos = new THREE.Vector3(-50,100,20); 
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true // this makes the objects appear smoother
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight); 
    document.body.appendChild(this.renderer.domElement); // creating and appending the render to the dom

    window.addEventListener("resize", this.onWindowResize.bind(this), false); // adding the event listener to trigger a resize
    this.addOnClicks();
    this.addDragControls();
    this.buildEarth();
    this.buildStars();
    this.addConnectorLines();
    this.animate(); 
  }

  buildEarth() {
    const geometry = new THREE.SphereGeometry( 10, 32, 16);
    geometry.thetaStart = 100;
    const material = new THREE.MeshBasicMaterial();
    material.map = new THREE.TextureLoader().load( 'dist/assets/images/earthMesh.jpeg' );
    const sphere = new THREE.Mesh( geometry, material );
    this.scene.add( sphere ); 
  }

  buildStars() {
    this.starsGeo = new THREE.BufferGeometry(); // creating an empty geometry object
    // create vertexes for stars to sit
    const vertices = this.generateAllVertices();
    this.starsGeo.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ));
    let sprite = new THREE.TextureLoader().load( '../../dist/assets/images/star.png' );
    let starMaterial = new THREE.PointsMaterial({ // creating a material of the texture
      size: 100, 
      transparent: true, 
      map: sprite
    })
    const stars = new THREE.Points(this.starsGeo, starMaterial); // mapping the points with the material 
    this.scene.add(stars); // adding those points to the this.scene
  }

  generateAllVertices() {
    const realStars = [];
    const zodiacStars = data.getXYZ(data.starData);
    const fillerStarsXYZ = data.getXYZ(data.fillerStars);

    for(let i=0; i < zodiacStars.length ; i++){
      const spreadXYZ = zodiacStars[i] * 100;
      realStars.push(spreadXYZ);
    }
    for(let i=0; i < fillerStarsXYZ.length ; i++){ /// filler accurate stars that are closer to the signs
      const spreadXYZ = fillerStarsXYZ[i] * 100;
      realStars.push(spreadXYZ);
    }
    const vertices = realStars.concat(this.generateRandomStars());

    return vertices;
  }

  generateRandomStars(){
    const multipliers = [[2,2,2],[-2,2,2],[-2,-2,2],[-2,-2,-2],[2,-2,-2],[2,2,-2],[2,-2,2],[-2,2,-2]]
    const vertices = [];
    for(let i = 0; i<8; i++){
      const xm = multipliers[i][0];
      const ym = multipliers[i][1];
      const zm = multipliers[i][2];
      for(let j=0; j < 1200 ; j++){ // fake filler stars for around the "galaxy"
        const x = (Math.random() * 25000) * xm - 1;
        const y = (Math.random() * 25000) * ym - 1;
        const z = (Math.random() * 25000) * zm - 1;
        vertices.push(x,y,z)
      }
    }
    return vertices;
  }
  
  wheelOnClick(star){
    this.explore = false; 
    this.exploreOff();
    let pX = data.posData[star]['pX'];
    let pY = data.posData[star]['pY'];
    let pZ = data.posData[star]['pZ'];

    let aX = data.posData[star]['aX'];
    let aY = data.posData[star]['aY'];
    let aZ = data.posData[star]['aZ'];

    this.cameraPos = new THREE.Vector3(pX,pY,pZ);
    this.cameraRot = [aX,aY,aZ];
    this.rotateWheel(star)
    const welcome = document.getElementById("welcome");
    welcome.style.display = 'none'
  }

  rotateWheel(star){
    const wheel = document.getElementById("wheelContainer");
    wheel.className = "";
    wheel.classList.add(`s${star}`);
    setTimeout(() => wheel.classList.remove(`s${star}`) , 2000);
    wheel.classList.add(`r${star}`);   
  }

  exploreOnclick() {
    this.explore = !this.explore;
    if(this.explore){
      this.exploreOn();
    }else{
      this.exploreOff();
    }
    const welcome = document.getElementById("welcome")
    welcome.style.display = 'none'
  }

  exploreOn(){
    const exploreButton = document.getElementById('explore');
    exploreButton.classList.add("spinning")
  }

  exploreOff(){
    const exploreButton = document.getElementById('explore');
    exploreButton.classList.remove("spinning");
  }

  addConnectorLines() {
    for(let i=0; i<data.posData.length; i++){ 
      this.generateConnectorLines(data.posData[i]['stars']);
    }
  }

  generateConnectorLines(constellation) {
    const points = [];
    const pointsArr = data.getLinePoints(constellation);
    for(let i = 0;i<pointsArr.length; i++){
      const x = pointsArr[i][0];
      const y = pointsArr[i][1];
      const z = pointsArr[i][2];
      points.push( new THREE.Vector3(x,y,z) );
    }
    const material = new THREE.LineBasicMaterial( { color: 0x0000ff } );
    const geometry = new THREE.BufferGeometry().setFromPoints( points );
    const line = new THREE.Line( geometry, material );
    this.scene.add( line );
  }

  addDragControls() {
    this.controls = new OrbitControls( this.camera, this.renderer.domElement );
    this.controls.addEventListener( 'change', this.render.bind(this) ); // only need this because its a static animation
    this.controls.dampingFactor = 0.05;
    this.controls.screenSpacePanning = false;
    this.controls.minDistance = 1;
    this.controls.maxDistance = 1000000;
  }

  rotateCamera(target, current) {
    if(
      target[0] !== current[0] ||
      target[1] !== current[1] ||
      target[2] !== current[2]
    ){
      for(let i=0;i<3;i++){
        let t = target[i];
        let c = current[i];
        let dif = Math.abs(t-c);

        if(t < c){
          if(dif <= 0.015){
            current[i] = t; 
          }else{
            current[i] -= 0.015;
          }
        }else if(t > c){
          if(dif <= 0.015){
            current[i] = t; 
          }else{
            current[i] += 0.015;
          }
        }
      }
    }
    this.setCameraRotation(current);
  }

  setCameraRotation(target) {
    this.camera.rotation.set(target[0],target[1],target[2]);
  }

  currentCameraRotation() {
    const rotation = []; 
    let x = parseFloat(this.camera.rotation._x.toFixed(3));
    let y = parseFloat(this.camera.rotation._y.toFixed(3));
    let z = parseFloat(this.camera.rotation._z.toFixed(3));
    rotation.push(x,y,z);
    return rotation
  }

  addOnClicks() {
    const pisces = document.getElementById('pisces');
    const aires = document.getElementById('aires');
    const gemini = document.getElementById('gemini');
    const taurus = document.getElementById('taurus');
    const aquarius = document.getElementById('aquarius');
    const cap = document.getElementById('cap');
    const cancer = document.getElementById('cancer');
    const sag = document.getElementById('sag');
    const scorpio = document.getElementById('scorpio');
    const libra = document.getElementById('libra');
    const leo = document.getElementById('leo');
    const virgo = document.getElementById('virgo');
    const explore = document.getElementById('explore');
/// I know I know I know this is bad and needs to be refacotred
    pisces.addEventListener("click", this.wheelOnClick.bind(this,0));
    aires.addEventListener("click", this.wheelOnClick.bind(this,1));
    gemini.addEventListener("click", this.wheelOnClick.bind(this,2));
    taurus.addEventListener("click", this.wheelOnClick.bind(this,3));
    aquarius.addEventListener("click", this.wheelOnClick.bind(this,4));
    cap.addEventListener("click", this.wheelOnClick.bind(this,5));
    cancer.addEventListener("click", this.wheelOnClick.bind(this,6));
    sag.addEventListener("click", this.wheelOnClick.bind(this,7));
    scorpio.addEventListener("click", this.wheelOnClick.bind(this,8));
    libra.addEventListener("click", this.wheelOnClick.bind(this,9));
    leo.addEventListener("click", this.wheelOnClick.bind(this,10));
    virgo.addEventListener("click", this.wheelOnClick.bind(this,11));
    explore.addEventListener("click", this.exploreOnclick.bind(this));
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate() {
    if(!this.explore){
      const currentRotation = this.currentCameraRotation();
      this.rotateCamera(this.cameraRot,currentRotation);
      this.camera.position.lerp(this.cameraPos,0.05);
    }
    this.render();
    window.requestAnimationFrame(this.animate.bind(this)) // YOU ALWAYS HAVE TO DO THIS WHEN CALLING REQUEST ANIMATION FRAME IN OOP!!!
  }

  render() {
    this.renderer.render( this.scene, this.camera );
  }

}

export default StarMap;



