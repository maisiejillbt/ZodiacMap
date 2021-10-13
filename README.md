# Constellation Map

### https://maisiejillbt.github.io/ConstellationMap/

## - Constellation map is a 3D rendering of the some of the most famous zodiac constellations in our visible universe. 

With Constellation Map you can easily toggle between zodiac signs to view the constellations as if you're right there with them in space.

Constellation Map uses ThreeJs in order to map the stars and make them appear on your screen in 3D. It also uses data from AstroNexus (https://github.com/astronexus/HYG-Database) in order to map the stars as they would be found in space. 

(this is an ambitious and likely very unrealistic wireframe given the time constraints.)
![](https://raw.githubusercontent.com/maisiejillbt/ConstellationMap/main/StarMap.svg)

1) A 3D map of 12 constellations 
2) A zodiac wheel that can be used to navigate to different constillations 
3) The ability to use a click and in order to "rotate" the constillation to view it from different angles 

## Libraries, API's and Tech 
- Webpack and Babel to bundle and transpile the source JavaScript code
- ThreeJs in order to render 3D constellations
- AstroNexus gitHub API for positions of stars

## Timeline 

- D1 (10/11/2021) Get first 1000 stars in dataset to map correctly and animate with spheres instead of 2D objects

- D2 (10/12/2021) Create filtering functions to find correct stars for each constellation and add "constellation" attribute to each. Render only constellation stars 

- D3 (10/13/2021) Edit camera angles to show the correct view of each constellation and add static buttons to navigate to that point in space 
    - firgure out smoothing of camera angle change
    - create list of points to "look at" 
    - adjust entry point to be more ~aestetic~
    - add GH and Li 
    - make simple intro ?
    - add a favicon

- D4 (10/14/2021) Wrap up 


## Post Due-Date 

 - Add lines that connect the constellations  
 - Add "wheel" graphic that spins as different constellations are selected  
