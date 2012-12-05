/**
 * a script for loading bar chart scene - @author Yane Frenski
 */

// *** GENERAL SETTINGS *******************************************************
// ****************************************************************************
var pieRadius = 750;
// Background Color
var backColor = "000000";
// Colour for the text on each bar
var valTextColor = "ffffff";
// the thickness of the pie
var pieHeight = 150;


// *** GLOBAL VARIABLES *******************************************************
// ****************************************************************************

// Main scene vars
var camera, scene, renderer, projector;
var mouse = { }, INTERSECTED; 

// pies array
var pies, intersobj;


// *** VARIABLES INITIALIZATION ***********************************************
// ****************************************************************************

function initSceneVars(){
  
  // mouse position
  //-3000 to make ot out of the screen
  mouse.x = -3000;
  mouse.y = -3000;
  INTERSECTED = null;
  
  // pies array
  pies = [];
  intersobj = [];
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
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setSize( window.innerWidth, window.innerHeight );
  
  // Switch off the shadows for safari due to the three.js bug with it
  if( !$.browser.safari && $.browser.version != "534.57.2"){
    renderer.shadowMapEnabled = true;
    renderer.shadowMapSoft = true;
  }
  
  $('body').append( renderer.domElement );
  
  // Creating new scene
  scene = new THREE.Scene();
  
  // Setting the camera
  camera = new THREE.PerspectiveCamera( 70, 
                                        window.innerWidth/window.innerHeight,
                                        1, 
                                        5000 );
  camera.position.z = 1200;
  camera.position.x = 500;
  camera.position.y = 700;
  
  // Setting controls for the trackball camera
  controls = new THREE.TrackballControls( camera, renderer.domElement );
  controls.zoomSpeed = 0.3;
  controls.rotateSpeed = 0.1;
  controls.minDistance = 500;
  controls.maxDistance = 3500;
  
  // Calclulating total value of all fields
  var totalVal = getTotalArr ( dataValues ); 
  // Setting the current angle of rotation
  var curAngle = 0;
  var extrudeOpts = { amount: pieHeight, 
                      bevelEnabled: true, 
                      bevelSegments: 5, 
                      steps: 5 };

  //*** Adding pies
  for ( var i=0; i<schema.cols.length; i++ ) {
    if( dataValues[i][0] > 0 ){
      pies.push( new PiePart( dataValues[i][0], totalVal, pieRadius, 
                              curAngle, {x:0,y:0,z:0}, extrudeOpts, 
                              schema.cols[i].color, valTextColor, "full" ) );
      curAngle = pies[pies.length-1].addPie(scene);
      // Adds the pies objects to ones that need to be checked for intersection
      // This is used for the moseover action
      intersobj[pies.length-1] = pies[pies.length-1].pieobj;
      intersobj[pies.length-1].pieid = pies.length-1;
    }
  }
  
  //////////////////
  
  
  //*** Adding the lights
  var light = new THREE.DirectionalLight( 0x777777 );
  light.position.set( 1, -1, 1 ).normalize();
  scene.add( light );
  
  var light = new THREE.DirectionalLight( 0x777777 );
  light.position.set( -1, 1, -1 ).normalize();
  scene.add( light );
  
  light = new THREE.SpotLight( 0xffffff, 1 );
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
  
  // funciton to get the mouse position for the hover efect onthe pies
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
        for( var i=0; i<pies.length; i++ ){
          pies[i].hideLabel();
        }
      }
      INTERSECTED = intersects[ 0 ].object;
      INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
      INTERSECTED.material.emissive.setHex( 
        parseInt( pies[intersects[0].object.pieid].darklumcolor, 16 ) );
      pies[intersects[0].object.pieid].showLabel()
    }
  } else {
    if ( INTERSECTED ) {
      INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
      for( var i=0; i<pies.length; i++ ){
        pies[i].hideLabel();
      }
    }
    INTERSECTED = null;
  }

  renderer.render( scene, camera );

}