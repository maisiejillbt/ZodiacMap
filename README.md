# Zodiac Map

### [Live Site](https://maisiejillbt.github.io/ZodiacMap/)

## - Zodiac Map is a spacially accurate 3D rendering of 12 of the most famous zodiac constellations in our visible universe.

![](https://github.com/maisiejillbt/ZodiacMap/blob/64ec902a5534dfa4b9fc1891caedaad8c4ab669e/dist/assets/images/welcome.png)

With Zodiac Map you can easily toggle between zodiac signs to view the constellations as if you're right there with them in space. Click a Zodiac Sign on the astrological wheel to view that signs constellation. To interact with the map click 'Explore', use click and drag or scroll to zoom out. Zodiac Map uses ThreeJs in order to render the stars and make them appear on your screen in 3D. It also uses data from [AstroNexus](https://github.com/astronexus/HYG-Database) in order to map the stars as they would be found in space. 

***

This was my first time working with three.js and I was luckily able to pick it up fairly quickly. I decided to render the stars using three.js Points, rendering my stars in this way meant that my app is able to load incredibly quickly, despite there being almost 10,000 stars in the scene. This is because Points use one single "material" rendered over many different "points" within the three.js scene. 

``` javascript 
  buildStars() {
    this.starsGeo = new THREE.BufferGeometry(); // creating an empty geometry object
    // create vertexes for stars to sit
    const vertices = this.generateAllVertices();
    this.starsGeo.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ));
    let sprite = new THREE.TextureLoader().load( 'dist/assets/images/star.png' );
    let starMaterial = new THREE.PointsMaterial({ // creating a material of the texture
      size: 100, 
      transparent: true, 
      map: sprite
    })
    const stars = new THREE.Points(this.starsGeo, starMaterial); // mapping the points with the material 
    this.scene.add(stars); // adding those points to the this.scene
  }
```

## Features 

### Moving the three.js Camera to view different Zodiac Signs 

One of the biggest chalenges I had while making Zodiac Map was that three.js doenst have a build in function to rotate the angle of the camera in a smooth way. While there are other libraries that provide the ability to rotate camera, I decided that the easiest solution for me would be to write out a simple camera rotation function. I created this function with O(1) time complexity, which was essential given the function runs on almost every iteration of render. 

``` javascript 
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

```

#### Using the SVG Zodiac wheel, you can navigate to different constellations, the motion I created with the rotate function is supposed to give users the effect of careening through space to get to their next destination. 

![](https://github.com/maisiejillbt/ZodiacMap/blob/64ec902a5534dfa4b9fc1891caedaad8c4ab669e/dist/assets/images/virgo.png)


### Interactive Feature within the Map Scene 

Creating the Explore feature was not only a great addition to the UI of the app, but also essential for development. Activate the Expore feature by pressing 'explore'. Use any combination of scroll, click and drag and your arrow keys to move around the map. You'll be able to navigate and view exactly where the the zodiac connection lines meet the stars, or scroll out to view the earth and signs from a whole different perspective. 

![](https://github.com/maisiejillbt/ZodiacMap/blob/64ec902a5534dfa4b9fc1891caedaad8c4ab669e/dist/assets/images/explore.png)


## Technologies 

- three.js and Canvas for rendering 3D scene
- SVG elements for creating Zodiac Wheel and intro elements 
- SCSS for animation and styling 

