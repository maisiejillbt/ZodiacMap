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
    this.lookAt;

    this.onWindowResize.bind(this);
    this.animate.bind(this);
    this.render.bind(this);
    this.addStars.bind(this);
    this.addEarth.bind(this);
    this.addDragControls.bind(this);
    this.addConnectorLines.bind(this);
    // this.onclick.bind(this);
  }

  init() {
    this.scene = new THREE.Scene(); // creating a this.scene
    this.camera = new THREE.PerspectiveCamera(
      45, 
      window.innerWidth / window.innerHeight, 
      1, 
      1000000); //setting a this.camera 

    this.camera.position.set(-47.935082578202305,52.845854487551854,32.13822592670376); // setting cameras z axis position 
    
    
    
    this.cameraPos = new THREE.Vector3(-47.935082578202305,52.845854487551854,32.13822592670376); 

    
    
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true // this makes the objects appear smoother
    });

    this.renderer.setSize(window.innerWidth, window.innerHeight); 
    document.body.appendChild(this.renderer.domElement); // creating and appending the render to the dom

    window.addEventListener("resize", this.onWindowResize.bind(this), false); // adding the event listener to trigger a resize
    this.addDragControls();
    this.addEarth();
    this.addStars();
    this.addConnectorLines(data.psc);
    this.addConnectorLines(data.ari);
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
    const XYZ = data.getXYZ();

    for(let i=0; i < XYZ.length ; i++){
      const spreadXYZ = XYZ[i] * 100;
      vertices.push(spreadXYZ);
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
  
  onclick(){
    this.cameraPos = new THREE.Vector3(-0.9833206122014612,-0.17502404380186368, -0.049468754896264726);
    this.lookAt = new THREE.Vector3(180,95,30);
    this.camera.lookAt(this.lookAt)
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
    console.log(pointsArr)
    const material = new THREE.LineBasicMaterial( { color: 0x0000ff } );

    const geometry = new THREE.BufferGeometry().setFromPoints( points );

    const line = new THREE.Line( geometry, material );

    this.scene.add( line );

    ////////// REMOVE 
    let button = document.getElementById('pisces')
    button.addEventListener("click", this.onclick.bind(this));
  }

  addDragControls() {
    this.controls = new OrbitControls( this.camera, this.renderer.domElement );
    this.controls.addEventListener( 'change', this.render.bind(this) ); // only need this because its a static animation
    this.controls.dampingFactor = 0.05;
    this.controls.screenSpacePanning = false;
    this.controls.minDistance = 1;
    this.controls.maxDistance = 1000000;
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate() {
    // console.log(this.camera.position);
    // console.log(this.camera.rotation)
    this.starsGeo.verticesNeedUpdate = true;
    this.render();
    this.camera.position.lerp(this.cameraPos,0.05);
    // this.camera.lookAt(this.currentConstellation)
    window.requestAnimationFrame(this.animate.bind(this)) // YOU ALWAYS HAVE TO DO THIS WHEN CALLING REQUEST ANIMATION FRAME IN OOP!!!
  }

  render() {
    this.renderer.render( this.scene, this.camera );
  }

}

export default StarMap;



