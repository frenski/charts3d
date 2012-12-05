/**
 * a script for loading bar chart scene for WebGL - @author Yane Frenski
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
  
  // changes background colour
  $('body').css('background-color', '#'+backColor);
  
  // removes previous canvas if exists
  $('canvas').remove();
  
  // Getting the projector for picking objects
  projector = new THREE.Projector();
  
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
  
}


// *** SCENE INITIALIZATION FOR WEBGL RENDERER ********************************
// ****************************************************************************

function initWebGLScene () {
  
  // Setting the renderer (with shadows)
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setSize( window.innerWidth, window.innerHeight );
  
  // Switch off the shadows for safari due to the three.js bug with it
  if( !$.browser.safari && $.browser.version != "534.57.2"){
    renderer.shadowMapEnabled = true;
    renderer.shadowMapSoft = true;
  }
  
  $('body').append( renderer.domElement );
  
  //*** Adding the grounds
  // material for the grounds
  var gridTex = THREE.ImageUtils.loadTexture("img/grid_pattern1.jpg");
  gridTex.wrapS = gridTex.wrapT = THREE.RepeatWrapping;
  gridTex.repeat.set( 5, 5 );
  
  var gridTex2 = THREE.ImageUtils.loadTexture("img/grid_pattern2.jpg");
  gridTex2.wrapS = gridTex2.wrapT = THREE.RepeatWrapping;
  gridTex2.repeat.set( schema.rows.length, schema.cols.length );
  
  var materialX = new THREE.MeshPhongMaterial({
    ambient : 0x444444,
    color : 0x777777,
    shininess : 70, 
    specular : 0x888888,
    shading : THREE.SmoothShading,
    side: THREE.DoubleSide,
    map:gridTex2
  });
  
  var materialYZ = new THREE.MeshPhongMaterial({
    ambient : 0x444444,
    color : 0x999999,
    shininess : 70, 
    specular : 0x888888,
    shading : THREE.SmoothShading,
    side: THREE.DoubleSide,
    map:gridTex
  });
  
  // Creating the ground-x
  var geometry = new THREE.PlaneGeometry( 
                        squareStep*schema.rows.length, 
                        squareStep*schema.cols.length );
                        
  var groundX = new THREE.Mesh( geometry, materialX );
  groundX.rotation.x -= Math.PI/2;
  groundX.castShadow = false;
  groundX.receiveShadow = true;
  groundX.position.y = yDeviation;
  scene.add( groundX );
  
  // Creating the ground-y
  var geometry = new THREE.PlaneGeometry( 
                        squareStep*schema.rows.length, 
                        valHeight );
                        
  var groundY = new THREE.Mesh( geometry, materialYZ );
  groundY.castShadow = false;
  groundY.receiveShadow = true;
  groundY.position.z = zDeviation;
  scene.add( groundY );
  
  // craating the groynd-z
  var geometry = new THREE.PlaneGeometry( 
                        squareStep*schema.cols.length, 
                        valHeight );
                        
  var groundZ = new THREE.Mesh( geometry, materialYZ );
  groundZ.rotation.y -= Math.PI/2;
  groundZ.castShadow = false;
  groundZ.receiveShadow = true;
  groundZ.position.x = xDeviation;
  scene.add( groundZ );
  //////////////////
  
  
  //*** Adding texts for the scales
  for( var i=0; i<schema.cols.length; i++ ) {
    sTextCols[i] = new ScaleText(schema.cols[i].name, 
                                 "col", 
                                  i, 
                                  schema.cols[i].color);
    sTextCols[i].addText(groundX);
  }
  
  for( var i=0; i<schema.rows.length; i++ ) {
    sTextRows[i] = new ScaleText(schema.rows[i].name, "row", i, scaleTextColor);
    sTextRows[i].addText(groundX);
  }
  
  for ( var i=0; i<=valHeight/squareStep*2; i++ ) {
    var val = scaleDif*i/10;
    sTextVals[i] = new ScaleText(val.toString(), "val", i, scaleTextColor);
    sTextVals[i].addText(groundZ);
  }
  
  
  //*** Adding bars
  for ( var i=0; i<schema.cols.length; i++ ) {
    for (var j=0; j<schema.rows.length; j++ ) {
      bars.push( new BarCube( schema.cols[i].color, j, i, 
                              dataValues[i][j], valTextColor, 'full' ) );
      bars[bars.length-1].addBar(scene);
      // Adds the bars objects to ones that need to be checked for intersection
      // This is used for the moseover action
      intersobj[bars.length-1] = bars[bars.length-1].barobj;
      intersobj[bars.length-1].barid = bars.length-1;
    }
  }
  
  //////////////////
  
  
  //*** Adding the lights
  var light = new THREE.DirectionalLight( 0x999999 );
  light.position.set( 1, -1, 1 ).normalize();
  scene.add( light );
  
  var light = new THREE.DirectionalLight( 0x999999 );
  light.position.set( -1, 1, -1 ).normalize();
  scene.add( light );
  
  light = new THREE.SpotLight( 0xd8d8d8, 2 );
  light.position.set( 600, 3000, 1500 );
  light.target.position.set( 0, 0, 0 );
  
  light.shadowCameraNear = 1000;
  light.shadowCameraFar = 5000;
  light.shadowCameraFov = 40;
  light.castShadow = true;
  light.shadowDarkness = 0.3;
  light.shadowBias = 0.0001;
  // light.shadowCameraVisible  = true;
  scene.add( light );
  ////////////////////
  
}


// *** SCENE INITIALIZATION FOR CANVAS RENDERER ********************************
// ****************************************************************************

function initCanvasScene () {
  // Setting the Canavas renderer
  renderer = new THREE.CanvasRenderer( );
  renderer.setSize( window.innerWidth, window.innerHeight );
  
  $('body').append( renderer.domElement );
  
  
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


  // Adding scale texts - rows ***
  //******************************
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
  
}


// *** SCENE INITIALIZATION ***************************************************
// ****************************************************************************

function initScene() {
  
  // Detecting the renderer - from webgl detector
  var ifcanvas = !! window.CanvasRenderingContext2D;
  var ifwebgl = ( function () { try { return !! window.WebGLRenderingContext && !! document.createElement( 'canvas' ).getContext( 'experimental-webgl' ); } catch( e ) { return false; } } )();
  
  // Init vars and scene depending on the renderer
  if ( ifwebgl ) {
    initSceneVars ();
    initWebGLScene ();
  }
  else if ( ifcanvas ) {
    initSceneVars ();
    initCanvasScene ();
  }
  else {
    alert("Your browser doesn't support this function!");
  }
  
  // **** Mouse controls *********************
  // Setting controls for the trackball camera
  controls = new THREE.TrackballControlsTouch( camera, renderer.domElement );
  controls.zoomSpeed = 0.3;
  controls.rotateSpeed = 0.1;
  controls.minDistance = 500;
  controls.maxDistance = 3500;
  
  // funciton to get the mouse position for the hover efect on the bars
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
  // url: http://mrdoob.github.com/three.js/examples/webgl_interactive_cubes.html
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