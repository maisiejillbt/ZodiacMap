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

    this.test1 = [20,25,15];
    this.test2 = [1,2,3];
  }

  init() {
    this.scene = new THREE.Scene(); // creating a this.scene
    this.camera = new THREE.PerspectiveCamera(
      45, 
      window.innerWidth / window.innerHeight, 
      1, 
      1000000); //setting a this.camera 

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
    this.addEarth();
    this.addStars();

    for(let i=0; i<data.posData.length; i++){
      this.addConnectorLines(data.posData[i]['stars']);
    }
    this.animate(); 
  }

  addEarth() {
    const geometry = new THREE.SphereGeometry( 10, 32, 16);
    geometry.thetaStart = 100;
    const material = new THREE.MeshBasicMaterial();
    material.map = new THREE.TextureLoader().load('earthMesh.jpeg');
    const sphere = new THREE.Mesh( geometry, material );
    this.scene.add( sphere ); 
  }

  addStars() {
    this.starsGeo = new THREE.BufferGeometry(); // creating an empty geometry object
    // create vertexes for stars to sit
    const vertices = [];
    const XYZ = data.getXYZ(data.starData);
    const fillerStars = data.getXYZ(data.fillerStars);
    // console.log(data.fillerStars)

    for(let i=0; i < XYZ.length ; i++){
      const spreadXYZ = XYZ[i] * 100;
      vertices.push(spreadXYZ);
    }

    for(let i=0; i < fillerStars.length ; i++){
      const spreadXYZ = fillerStars[i] * 100;
      vertices.push(spreadXYZ);
    }

    for(let i=0; i < 10000 ; i++){
      const x = Math.random() * 100000 - 30000;
      const y = Math.random() * 100000 - 30000;
      const z = Math.random() * 100000 - 30000;
      vertices.push(x,y,z)
    }

    this.starsGeo.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ));
    let sprite = new THREE.TextureLoader().load( 'star.png' );
    let starMaterial = new THREE.PointsMaterial({ // creating a material of the texture
      size: 100, 
      transparent: true, 
      map: sprite
    })
    const stars = new THREE.Points(this.starsGeo, starMaterial); // mapping the points with the material 
    this.scene.add(stars); // adding those points to the this.scene


  }
  
  onclick(star){
    let pX = data.posData[star]['pX'];
    let pY = data.posData[star]['pY'];
    let pZ = data.posData[star]['pZ'];

    let aX = data.posData[star]['aX'];
    let aY = data.posData[star]['aY'];
    let aZ = data.posData[star]['aZ'];

    this.cameraPos = new THREE.Vector3(pX,pY,pZ);
    this.cameraRot = [aX,aY,aZ];

    const welcome = document.getElementById("welcome")
    welcome.style.display = 'none'
  }

  exploreOnclick() {
    this.explore = !this.explore;
    const exploreButton = document.getElementById('explore');
    if(this.explore){
      exploreButton.classList.add("spinning")
    }else{
      exploreButton.classList.remove("spinning")
    }
    const welcome = document.getElementById("welcome")
    welcome.style.display = 'none'
  }

  addConnectorLines(constellation) {
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
    let pisces = document.getElementById('pisces');
    let aires = document.getElementById('aires');
    let gemini = document.getElementById('gemini');
    let taurus = document.getElementById('taurus');
    let aquarius = document.getElementById('aquarius');
    let cap = document.getElementById('cap');
    let cancer = document.getElementById('cancer');
    let sag = document.getElementById('sag');
    let scorpio = document.getElementById('scorpio');
    let libra = document.getElementById('libra');
    let leo = document.getElementById('leo');
    let virgo = document.getElementById('virgo');

    let explore = document.getElementById('explore');


/// I know I know I know this is bad and needs to be refacotred
    pisces.addEventListener("click", this.onclick.bind(this,0));
    aires.addEventListener("click", this.onclick.bind(this,1));
    gemini.addEventListener("click", this.onclick.bind(this,2));
    taurus.addEventListener("click", this.onclick.bind(this,3));
    aquarius.addEventListener("click", this.onclick.bind(this,4));
    cap.addEventListener("click", this.onclick.bind(this,5));
    cancer.addEventListener("click", this.onclick.bind(this,6));
    sag.addEventListener("click", this.onclick.bind(this,7));
    scorpio.addEventListener("click", this.onclick.bind(this,8));
    libra.addEventListener("click", this.onclick.bind(this,9));
    leo.addEventListener("click", this.onclick.bind(this,10));
    virgo.addEventListener("click", this.onclick.bind(this,11));
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



