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
    this.onWindowResize.bind(this);
    this.animate.bind(this);
    this.render.bind(this);
    this.addStars.bind(this);
    this.addEarth.bind(this);
  }

  init() {
    this.scene = new THREE.Scene(); // creating a this.scene
    this.camera = new THREE.PerspectiveCamera(
      45, 
      window.innerWidth / window.innerHeight, 
      1, 
      1000000); //setting a this.camera 

    this.camera.position.set(0,0,0); // setting cameras z axis position 

    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });

    this.renderer.setSize(window.innerWidth, window.innerHeight); 
    document.body.appendChild(this.renderer.domElement); // creating and appending the render to the dom

    this.starsGeo = new THREE.BufferGeometry(); // creating an empty geometry object

    // setting up drag controls
    this.controls = new OrbitControls( this.camera, this.renderer.domElement );
    this.controls.addEventListener( 'change', this.render ); // call this only in static scenes (i.e., if there is no animation loop)
    this.controls.dampingFactor = 0.05;
    this.controls.screenSpacePanning = false;
    this.controls.minDistance = 1;
    this.controls.maxDistance = 1000000;

    window.addEventListener("resize", this.onWindowResize, false); // adding the event listener to trigger a resize
    this.addEarth();
    this.addStars();
    this.animate(); 
  }

  addEarth() {
    const geometry = new THREE.SphereGeometry( 10, 32, 16);
    geometry.thetaStart = 100;
    const material = new THREE.MeshBasicMaterial();
    material.map = THREE.ImageUtils.loadTexture('earthMesh.jpeg');
    const sphere = new THREE.Mesh( geometry, material );
    this.scene.add( sphere ); 
  }

  addStars() {
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

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate() {

    this.starsGeo.verticesNeedUpdate = true;
    
    this.render();
  
    window.requestAnimationFrame(this.animate.bind(this)) // YOU ALWAYS HAVE TO DO THIS WHEN CALLING REQUEST ANIMATION FRAME IN OOP!!!

  }

  render() {
    this.renderer.render( this.scene, this.camera );
  }


}

export default StarMap;



