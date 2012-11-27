/**
 * a script for loading bar chart scene - @author Yane Frenski
 */

// Main scene vars
var camera, scene, renderer, projector;
var mouse = { x: -3000, y: -3000 }, INTERSECTED = null; 
//-3000 to make ot out of the screen

// The deviation position of the ground from the center
var yDeviation, zDeviation, xDeviation;

// Creates the value scale variables
var minScaleVal, maxScaleVal, scaleDif;

// size of one square in real 3d units
var squareStep = 200;
// maximum height of the walls (y and z)
var valHeight = 1000;

// bars array
var bars = [], intersobj = [];

// scale texts arrays
var sTextVals = [], sTextRows = [], sTextCols = [];

function initSceneVars(){
  
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
  
}


function initScene() {
  
  initSceneVars()

  // Getting the projector for picking objects
  projector = new THREE.Projector();

  // Setting the renderer (with shadows)
  renderer = new THREE.WebGLRenderer( { antialias: true} );
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
    sTextRows[i] = new ScaleText(schema.rows[i].name, "row", i);
    sTextRows[i].addText(groundX);
  }
  
  for ( var i=0; i<=valHeight/squareStep*2; i++ ) {
    var val = scaleDif*i/10;
    sTextVals[i] = new ScaleText(val.toString(), "val", i, "aaaaaa");
    sTextVals[i].addText(groundZ);
  }
  
  
  //*** Adding bars
  for ( var i=0; i<schema.cols.length; i++ ) {
    for (var j=0; j<schema.rows.length; j++ ) {
      bars.push( new BarCube( schema.cols[i].color, j, i, dataValues[i][j] ) );
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
  
  light = new THREE.SpotLight( 0xebebeb, 2 );
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


// Main animatioon function - called on each frame
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