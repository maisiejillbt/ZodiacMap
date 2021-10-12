// const data = require("./data.js");
// const starData = data.starData


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
    this.controls.minDistance = 10;
    this.controls.maxDistance = 1000000;

    // adding earth

    const geometry = new THREE.SphereGeometry( 10, 32, 16 );
    const material = new THREE.MeshBasicMaterial( { color: 0x0000FF } );
    const sphere = new THREE.Mesh( geometry, material );
    this.scene.add( sphere ); 

    // create vertexes for stars to sit
    
    const vertices = [];

    const pisces = [ 
    [ '90.64277', '19.54864', '12.34802' ],
    [ '103.95528', '29.22937', '66.9657' ],
    [ '55.62481', '15.67321', '8.00892' ],
    [ '65.29865', '19.24386', '26.7788' ],
    [ '60.84974', '17.93635', '24.94481' ],
    [ '44.21131', '13.50659', '17.50453' ],
    [ '111.04471', '34.91644', '41.5836' ],
    [ '119.72599', '38.58579', '48.3737' ],
    [ '40.9393', '13.23482', '24.93066' ],
    [ '42.57204', '14.18866', '5.96796' ],
    [ '99.84693', '33.28672', '48.15082' ],
    [ '56.34385', '18.78486', '7.90187' ],
    [ '79.69521', '28.79668', '43.66944' ],
    [ '22.90552', '9.05213', '8.5635' ],
    [ '101.46628', '42.12334', '11.82612' ],
    [ '80.12015', '33.79598', '23.86334' ],
    [ '30.12822', '13.58748', '7.11044' ],
    [ '101.52464', '48.11616', '10.79349' ],
    [ '70.04679', '34.69276', '12.60105' ],
    [ '51.33721', '27.74507', '3.24975' ],
    [ '36.6961', '21.62572', '2.0562' ],
    [ '146.22507', '-36.54152', '10.06395' ],
    [ '39.36465', '-7.44545', '2.29753' ],
    [ '49.1735', '-7.14477', '1.0893' ],
    [ '47.91228', '-6.74014', '5.40926' ],
    [ '13.67223', '-1.19935', '1.35233' ],
    [ '30.7737', '-2.41545', '0.95951' ],
    [ '32.25565', '-0.0971', '3.88258' ],[ '-0.76319', '42.4468', '18.25149' ],
  [ '-6.4167', '98.7032', '40.98431' ],
  [ '-6.56655', '65.3273', '27.21441' ],
  [ '-18.22465', '143.44159', '53.23536' ],
  [ '-5.04957', '30.40998', '9.07235' ],
  [ '-47.77938', '246.19265', '117.64315' ],
  [ '-15.71041', '80.84524', '19.35948' ],
  [ '-3.35639', '16.76262', '3.91411' ],
  [ '-11.41402', '48.67446', '33.67292' ],
  [ '-6.42509', '26.43538', '6.36986' ],
  [ '-92.64907', '322.5271', '125.93418' ],
  [ '-24.40955', '76.09546', '46.596' ],
  [ '-9.26169', '26.12036', '8.23048' ],
  [ '-5.7281', '15.71155', '6.7506' ],
  [ '-12.47983', '31.79254', '18.00618' ],
  [ '-5.96086', '14.55032', '9.74324' ],
  [ '-5.38337', '12.29279', '8.34945' ],
  [ '-26.71078', '60.04778', '33.33621' ],
  [ '-16.74195', '36.24705', '27.52778' ],
  [ '-14.29801', '29.5402', '18.1049' ],
  [ '-17.63404', '35.97657', '18.1731' ],
  [ '-4.04731', '8.17808', '4.85711' ],
  [ '-44.35363', '88.83835', '33.24324' ],
  [ '-33.09758', '61.27833', '35.12836' ],
  [ '-35.86268', '59.97067', '36.83257' ] ]

    for(let i=0;i<pisces.length; i++){
      const x = parseFloat(pisces[i][0]) * 100; 
      const y = parseFloat(pisces[i][1]) * 100; 
      const z = parseFloat(pisces[i][2]) * 100; 
      vertices.push(x,y,z);
    }

    // for(let i=0; i < 886; i++){
    //   const x = parseFloat(starData[i]['X']) * 100; 
    //   const y = parseFloat(starData[i]['Y']) * 100; 
    //   const z = parseFloat(starData[i]['Z']) * 100; 
    //   vertices.push(x,y,z);
    // }

    // for(let i=0;i<5000;i++){ // adding 5000 random vector points to the this.scene
    //   const x = Math.random() * 10000;
    //   const y = Math.random() * 10000;
    //   const z = Math.random() * 10000;
    //   vertices.push(x,y,z); // adding the points to the vertices array
    // }

    this.starsGeo.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ));
  
    let sprite = new THREE.TextureLoader().load( 'star.png' );

    let starMaterial = new THREE.PointsMaterial({ // creating a material of the texture
      size: 100, 
      transparent: true, 
      map: sprite
      // color: 0x0000FF
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
    
    this.render();
  
    window.requestAnimationFrame(this.animate.bind(this)) // YOU ALWAYS HAVE TO DO THIS WHEN CALLING REQUEST ANIMATION FRAME IN OOP!!!

  }

  render() {
    this.renderer.render( this.scene, this.camera );
  }


}

export default StarMap;



