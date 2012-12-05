/**
 * a script for loading bar chart scene for Canvas - @author Yane Frenski
 */

// *** GENERAL SETTINGS *******************************************************
// ****************************************************************************
// size of one square in real 3d units
var squareStep = 200;
// maximum height of the walls (y and z)
var valHeight = 1000;
// Background Color
var backColor = "000000";
// Colour for the text on the x and y scales
var scaleTextColor = "eeeeee";
// Colour for the text on each bar
var valTextColor = "ffffff";


// *** GLOBAL VARIABLES *******************************************************
// ****************************************************************************

// Main scene vars
var camera, scene, renderer, projector;
var mouse = { }, INTERSECTED; 

// The deviation position of the ground from the center
var yDeviation, zDeviation, xDeviation;

// Creates the value scale variables
var minScaleVal, maxScaleVal, scaleDif;

// bars array
var bars, intersobj;

// scale texts arrays
var sTextVals, sTextRows, sTextCols;


// *** VARIABLES INITIALIZATION ***********************************************
// ****************************************************************************

function initSceneVars(){
  
  // mouse position
  //-3000 to make ot out of the screen
  mouse.x = -3000;
  mouse.y = -3000;
  INTERSECTED = null;
  
  // Inits deviation position of the ground from the center
  yDeviation = -(valHeight/2);
  zDeviation = -(schema.cols.length*squareStep/2);
  xDeviation = -(schema.rows.length*squareStep/2);

  // Inits the value scale variables
  minScaleVal = getMinArr ( dataValues );
  maxScaleVal = getMaxArr ( dataValues );
  if(minScaleVal > 0){
    minScaleVal = 0;
  }else{
    minScaleVal = getRoundMax ( minScaleVal );
  }
  maxScaleVal = getRoundMax ( maxScaleVal );
  scaleDif = maxScaleVal - minScaleVal;
  
  // bars array
  bars = [];
  intersobj = [];

  // scale texts arrays
  sTextVals = [];
  sTextRows = [];
  sTextCols = [];
  
}

// *** SCENE INITIALIZATION ***************************************************
// ****************************************************************************

function initScene() {
  
  initSceneVars();
  
  // changes background colour
  $('body').css('background-color', '#'+backColor);
  
  // removes previous canvas if exists
  $('canvas').remove();
  
  // Getting the projector for picking objects
  projector = new THREE.Projector();

  // Setting the renderer (with shadows)
  renderer = new THREE.CanvasRenderer( );
  renderer.setSize( window.innerWidth, window.innerHeight );
  
  $('body').append( renderer.domElement );
  
  // Creating new scene
  scene = new THREE.Scene();
  
  // Setting the camera
  camera = new THREE.PerspectiveCamera( 60, 
                                        window.innerWidth/window.innerHeight,
                                        1, 
                                        5000 );
  camera.position.z = 1600;
  camera.position.x = 500;
  camera.position.y = 500;
  
  // Setting controls for the trackball camera
  controls = new THREE.TrackballControls( camera, renderer.domElement );
  controls.zoomSpeed = 0.3;
  controls.rotateSpeed = 0.1;
  controls.minDistance = 500;
  controls.maxDistance = 3500;
  
  
  //*** Adding the grounds
  // *********************

  var groundSizeX = squareStep*schema.rows.length;
  var groundSizeY = squareStep*schema.cols.length;
  var lineMaterial = new THREE.LineBasicMaterial( { color: 0xaaaaaa, 
                                                    opacity: 0.8 } );
  
  // Adding the X ground
  
  var geometry = new THREE.Geometry();
  // putting the Y vertices
  for ( var i = 0; i <= groundSizeY; i += squareStep ) {
    geometry.vertices.push( new THREE.Vector3(  0, 0, i ) );
    geometry.vertices.push( new THREE.Vector3(  groundSizeX, 0, i ) );
  }
  // putting the X vertices
  for ( var i = 0; i <= groundSizeX; i += squareStep ) {
    geometry.vertices.push( new THREE.Vector3( i, 0, 0 ) );
    geometry.vertices.push( new THREE.Vector3( i, 0, groundSizeY ) );
  }
    
  // Creating the line object and positioning it
  var groundX = new THREE.Line( geometry, lineMaterial );
  groundX.type = THREE.LinePieces;
  groundX.position.y = yDeviation;
  groundX.position.z = zDeviation;
  groundX.position.x = xDeviation;
  scene.add( groundX );
  
  // Adding the Y ground
  
  var geometry = new THREE.Geometry();
  // putting the X vertices
  for ( var i = 0; i <= valHeight; i += squareStep ) {
    geometry.vertices.push( new THREE.Vector3(  0, 0, i ) );
    geometry.vertices.push( new THREE.Vector3(  groundSizeX, 0, i ) );
  }
      
  // Creating the line object and positioning it
  var groundY = new THREE.Line( geometry, lineMaterial );
  groundY.rotation.set( Math.PI/2, 0, 0 );
  groundY.type = THREE.LinePieces;
  groundY.position.y = -yDeviation;
  groundY.position.z = zDeviation;
  groundY.position.x = xDeviation;
  scene.add( groundY );
  
  // Adding the Y ground
  
  var geometry = new THREE.Geometry();
  // putting the X vertices
  for ( var i = 0; i <= valHeight; i += squareStep ) {
    geometry.vertices.push( new THREE.Vector3(  0, 0, i ) );
    geometry.vertices.push( new THREE.Vector3(  groundSizeY, 0, i ) );
  }
      
  // Creating the line object and positioning it
  var groundZ = new THREE.Line( geometry, lineMaterial );
  groundZ.rotation.set( Math.PI/2, 0, Math.PI/2 );
  groundZ.type = THREE.LinePieces;
  groundZ.position.y = -yDeviation;
  groundZ.position.z = zDeviation;
  groundZ.position.x = xDeviation;
  scene.add( groundZ );

  //**********************
  

  // Adding scale texts - rows
  var canvTexture = createTextureScale (schema.rows,  
                                        squareStep*schema.rows.length,
                                        squareStep,
                                        40, "#"+scaleTextColor, 
                                        "#"+backColor,
                                        "right");
  var texture = new THREE.Texture(canvTexture);
  texture.needsUpdate = true;
  
  var geometry = new THREE.PlaneGeometry( canvTexture.width, squareStep*schema.rows.length );
  var material = new THREE.MeshBasicMaterial( {  map: texture } );

  scalePlaneX = new THREE.Mesh( geometry, material );
  scalePlaneX.rotation.set ( 3*Math.PI/2, 0, Math.PI/2 );
  scalePlaneX.position.y = yDeviation;
  scalePlaneX.position.z = squareStep*(schema.cols.length)/2 + canvTexture.width/2 + 2;
  scene.add( scalePlaneX );
  
  // Adding scale texts - cols
  var canvTexture = createTextureScale (schema.cols,  
                                        squareStep*schema.cols.length,
                                        squareStep,
                                        40, "#"+scaleTextColor, 
                                        "#"+backColor,
                                        "left");
  var texture = new THREE.Texture(canvTexture);
  texture.needsUpdate = true;
  
  var geometry = new THREE.PlaneGeometry( canvTexture.width, squareStep*schema.cols.length );
  var material = new THREE.MeshBasicMaterial( {  map: texture } );

  scalePlaneX = new THREE.Mesh( geometry, material );
  scalePlaneX.rotation.set ( 3*Math.PI/2, 0, 0 );
  scalePlaneX.position.y = yDeviation
  scalePlaneX.position.x = squareStep*(schema.rows.length)/2 + canvTexture.width/2 + 2;
  scene.add( scalePlaneX );
  
  
  //*** Adding bars ************
  // ***************************
  for ( var i=0; i<schema.cols.length; i++ ) {
    for (var j=0; j<schema.rows.length; j++ ) {
      bars.push( new BarCube( schema.cols[i].color, j, i, 
                              dataValues[i][j], valTextColor, 'light' ) );
      bars[bars.length-1].addBar(scene);
      // Adds the bars objects to ones that need to be checked for intersection
      // This is used for the moseover action
      intersobj[bars.length-1] = bars[bars.length-1].barobj;
      intersobj[bars.length-1].barid = bars.length-1;
    }
  }
  
  //******************************
  
  
  //*** Adding the lights ********
  //******************************
	var ambientLight = new THREE.AmbientLight( 0xffffff );
	scene.add( ambientLight );

	var directionalLight = new THREE.DirectionalLight( Math.random() * 0xffffff );
	directionalLight.position.x = 0.4;
	directionalLight.position.y = 0.4;
	directionalLight.position.z = - 0.2;
	directionalLight.position.normalize();
	scene.add( directionalLight );

	var directionalLight = new THREE.DirectionalLight( Math.random() * 0xffffff );
	directionalLight.position.x = - 0.2;
	directionalLight.position.y = 0.5;
	directionalLight.position.z = - 0.1;
	directionalLight.position.normalize();
	scene.add( directionalLight );
  //******************************
  
  // funciton to get the mouse position for the hover efect onthe bars
  $(document).mousemove(function(event) {

    event.preventDefault();

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

  });

  // function to adjust the size of the canvas when resizing the window
  $(window).resize(function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
  });

}


// *** SCENE ANIMATION ********************************************************
// ****************************************************************************

function animateScene() {

  requestAnimationFrame( animateScene );
  
  // Updateing the controls for the trackball camera
  controls.update();
  
  // find intersections - from the Mr.Doob example
  // url: 
  var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
  projector.unprojectVector( vector, camera );
   
  var ray = new THREE.Ray( camera.position, 
                            vector.subSelf( camera.position ).normalize() );
  var intersects = ray.intersectObjects( intersobj );
  
  if ( intersects.length > 0 ) {
    if ( INTERSECTED != intersects[ 0 ].object ) {
      if ( INTERSECTED ) {
        INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
        for( var i=0; i<bars.length; i++ ){
          bars[i].hideLabel();
        }
      }
      INTERSECTED = intersects[ 0 ].object;
      INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
      INTERSECTED.material.emissive.setHex( 
        parseInt( bars[intersects[0].object.barid].darklumcolor, 16 ) );
      bars[intersects[0].object.barid].showLabel()
    }
  } else {
    if ( INTERSECTED ) {
      INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
      for( var i=0; i<bars.length; i++ ){
        bars[i].hideLabel();
      }
    }
    INTERSECTED = null;
  }
  
  renderer.render( scene, camera );

}