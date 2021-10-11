// import * as THREE from 'https://cdn.skypack.dev/three@0.120.0' // importing threeJs
// const starData = require('../../dist/assets/starData.json');
import * as THREE from 'three';


class StarMap {
  constructor() {
    this.camera; 
    this.scene;
    this.renderer; 
    this.starsGeo;
    this.stars;
    this.onWindowResize.bind(this);
    this.animate.bind(this);
  }

  init() {
    this.scene = new THREE.Scene(); // creating a this.scene
    this.camera = new THREE.PerspectiveCamera(
      30, 
      window.innerWidth / window.innerHeight, 
      1, 
      1000); //setting a this.camera 

    this.camera.position.z = 1; // setting cameras z axis position 
    this.camera.rotation.x = Math.PI/2; // setting the x rotation to half of pi

    this.renderer = new THREE.WebGLRenderer(); 
    this.renderer.setSize(window.innerWidth, window.innerHeight); 
    document.body.appendChild(this.renderer.domElement); // creating and appending the render to the dom

    this.starsGeo = new THREE.BufferGeometry(); // creating an empty geometry object
    
    const vertices = [];

    for(let i=0;i<5000;i++){ // adding 5000 random vector points to the this.scene
      const x = Math.random() * 1000 - 300;
      const y = Math.random() * 1000 - 300;
      const z = Math.random() * 1000 - 300;
      vertices.push(x,y,z); // adding the points to the vertices array
    }

    this.starsGeo.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ));

    let sprite = new THREE.TextureLoader().load( 'star.png' ); // creating a texture object
  
    let starMaterial = new THREE.PointsMaterial({ // creating a material of the texture
      size: 4,
      color: 0xaaaaaa,
      transparent: true
      // map: sprite
    })

    const stars = new THREE.Points(this.starsGeo, starMaterial); // mapping the points with the material 

    this.scene.add(stars); // adding those points to the this.scene

    window.addEventListener("resize", this.onWindowResize, false); // adding the event listener to trigger a resize
    this.animate(); 
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate() {
    this.starsGeo.verticesNeedUpdate = true; 
    this.renderer.render(this.scene, this.camera);
  }


}

export default StarMap;



