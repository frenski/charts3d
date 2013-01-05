/**
 * a script for loading bar chart scene for WebGL - @author Yane Frenski
 */

// *** GLOBAL VARIABLES *******************************************************
// ****************************************************************************

// Main scene vars
var camera, scene, renderer, projector;
var mouse = { }, touch = { },  INTERSECTED, intersectedId;

// The deviation position of the ground from the center
var yDeviation, zDeviation, xDeviation;

// Creates the value scale variables
var niceScale;

// bars array
var bars, intersobj;

// scale texts arrays
var sTextVals, sTextRows, sTextCols;


// *** VARIABLES INITIALIZATION ***********************************************
// ****************************************************************************

function initSceneVars(){
  
  // mouse/touch position
  //-3000 to make ot out of the screen
  mouse.x = -3000;
  mouse.y = -3000;
  touch.x = -3000;
  touch.y = -3000;
  touch.device = false;
  INTERSECTED = null;
  intersectedId = null;
  
  // Inits deviation position of the ground from the center
  yDeviation = -(valHeight/2);
  zDeviation = -(schema.cols.length*squareStep/2);
  xDeviation = -(schema.rows.length*squareStep/2);

  // Inits the value scale variables
  niceScale = new NiceScale ( getMinArr ( dataValues ), 
                              getMaxArr ( dataValues ) );
  niceScale.calculate ();
  
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
  
  var worldtex = THREE.ImageUtils.loadTexture(staticUrl+"img/world1.jpg");
  
  var sphereMaterial = new THREE.MeshPhongMaterial({
    ambient : 0x444444,
    color : 0x777777,
    shininess : 70, 
    specular : 0x888888,
    shading : THREE.SmoothShading,
    side: THREE.DoubleSide,
    map:worldtex
  });
  var globe = new THREE.Mesh(new THREE.SphereGeometry( globeRadius,
                                                        32,
                                                        32),
                              sphereMaterial);
  globe.receiveShadow = true;
  // add the sphere to the scene
  scene.add(globe);
  
  
  var dummysp1 = new THREE.Mesh( 
                          new THREE.SphereGeometry(10, 2, 2),
                          new THREE.MeshLambertMaterial({ color: 0xCC0000 }));

  // add the sphere to the scene
  scene.add(dummysp1);
  
  var dummysp2 = new THREE.Mesh( 
                          new THREE.SphereGeometry(10, 2, 2),
                          new THREE.MeshLambertMaterial({ color: 0xCC0000 }));

  // add the sphere to the scene
  dummysp1.add(dummysp2);
  
  var i=0; var j=0;
  bars.push( new BarCube( schema.cols[i].color, j, i, 
                          dataValues[i][j], valTextColor, 'full', null,
                          { row:schema.rows[j].name, 
                            col:schema.cols[i].name },
                            niceScale.niceMin, 
                            niceScale.range, 
                            valHeight ) );
  bars[bars.length-1].sqsize = 10;
  bars[bars.length-1].h += globeRadius;
  var c = country["Bulgaria"];
  console.log(c);
  bars[bars.length-1].addBar(dummysp2);
  // var pos = findGeoPosition(c.lat.toRad(),Math.PI+c.lng.toRad(),globeRadius);
  // bars[bars.length-1].reposition(pos.x,pos.y,pos.z);
  // bars[bars.length-1].reorientation(Math.PI/2+(c.lat).toRad(),Math.PI+(c.lng).toRad(),0);
  // Adds the bars objects to ones that need to be checked for intersection
  // This is used for the moseover action
  intersobj[bars.length-1] = bars[bars.length-1].barobj;
  intersobj[bars.length-1].barid = bars.length-1;
  
  bars[bars.length-1].reposition(0,bars[bars.length-1].h/2,0);
  // bars[bars.length-1].reorientation(c.lng,c.lat);
  globe.rotation.y += Math.PI;
  // dummysp.rotation.y += Math.PI;
  // dummysp.rotation.x = Math.PI/2;
  // dummysp.rotation.x -= (c.lat).toRad();
  // dummysp.rotation.z -= (c.lng).toRad();
  // dummysp.rotation.set(c.lat, 0 , c.lng);
  
  
  dummysp1.rotation.y = (c.lng).toRad();
  dummysp2.rotation.x = Math.PI/2 - (c.lat).toRad();
  
  // //*** Adding bars
  // for ( var i=0; i<schema.cols.length; i++ ) {
  //   for (var j=0; j<schema.rows.length; j++ ) {
  //     bars.push( new BarCube( schema.cols[i].color, j, i, 
  //                             dataValues[i][j], valTextColor, 'full', null,
  //                             { row:schema.rows[j].name, 
  //                               col:schema.cols[i].name },
  //                               niceScale.niceMin, 
  //                               niceScale.range, 
  //                               valHeight ) );
  //     bars[bars.length-1].addBar(scene);
  //     // Adds the bars objects to ones that need to be checked for intersection
  //     // This is used for the moseover action
  //     intersobj[bars.length-1] = bars[bars.length-1].barobj;
  //     intersobj[bars.length-1].barid = bars.length-1;
  //   }
  // }
  
  
  //*** Adding the lights
  var light = new THREE.DirectionalLight( 0x777777 );
  light.position.set( -1, 0, 1 ).normalize();
  scene.add( light );
  
  var light = new THREE.DirectionalLight( 0x777777 );
  light.position.set( 1, 0, -1 ).normalize();
  scene.add( light );
  
  
  light = new THREE.SpotLight( 0x999999, 2 );
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


// *** SCENE INITIALIZATION FOR CANVAS RENDERER *******************************
// ****************************************************************************

function initCanvasScene () {
  // Setting the Canavas renderer
  renderer = new THREE.CanvasRenderer( );
  renderer.setSize( window.innerWidth, window.innerHeight );
  
  $('body').append( renderer.domElement );
  
  var worldtex = THREE.ImageUtils.loadTexture(staticUrl+"img/world1.jpg");
  
  var sphereMaterial = new THREE.MeshPhongMaterial({
    ambient : 0x444444,
    color : 0x777777,
    shininess : 70, 
    specular : 0x888888,
    shading : THREE.SmoothShading,
    side: THREE.DoubleSide,
    map:worldtex
  });
  var globe = new THREE.Mesh(new THREE.SphereGeometry( 600,
                                                        16,
                                                        16),
                              sphereMaterial);
  // add the sphere to the scene
  scene.add(globe);
  
  //*** Adding bars ************
  // ***************************
  // for ( var i=0; i<schema.cols.length; i++ ) {
  //   for (var j=0; j<schema.rows.length; j++ ) {
  //     bars.push( new BarCube( schema.cols[i].color, j, i, 
  //                             dataValues[i][j], valTextColor, 
  //                             'light', $('#valuelabel'),
  //                             { row:schema.rows[j].name, 
  //                               col:schema.cols[i].name },
  //                               niceScale.niceMin, 
  //                               niceScale.range, 
  //                               valHeight ) );
  //     bars[bars.length-1].hasLabel = false;               
  //     bars[bars.length-1].addBar(scene);
  //     // Adds the bars objects to ones that need to be checked for intersection
  //     // This is used for the moseover action
  //     intersobj[bars.length-1] = bars[bars.length-1].barobj;
  //     intersobj[bars.length-1].barid = bars.length-1;
  //   }
  // }
  
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
  
  // Detecting the renderer:
  var browserRender = detectRenderer ( );
  
  // Init vars and scene depending on the renderer
  if ( browserRender == 'webgl' ) {
    initSceneVars ();
    initWebGLScene ();
  }
  else if ( browserRender == 'canvas' ) {
    initSceneVars ();
    initCanvasScene ();
  }
  else {
    alert("Your browser doesn't support this function!");
  }
  
  controls = mouseControls ( camera );

}


// *** SCENE ANIMATION ********************************************************
// ****************************************************************************

function animateScene() {

  requestAnimationFrame( animateScene );
  
  // Updateing the controls for the trackball camera
  controls.update();
  
  // find intersections - from the Mr.Doob example
  // url: http://mrdoob.github.com/three.js/examples/webgl_interactive_cubes.html
  
  // Checks first if it's touch or mouse device
  if (!touch.device) {
    var actCoord = { x: mouse.x, y: mouse.y };
  }else{
    var actCoord = { x: touch.x, y: touch.y };
  }
  
  var vector = new THREE.Vector3( actCoord.x, actCoord.y, 1 );
  
  projector.unprojectVector( vector, camera );
   
  var ray = new THREE.Ray( camera.position, 
                            vector.subSelf( camera.position ).normalize() );
  var intersects = ray.intersectObjects( intersobj );
  
  if ( intersects.length > 0 ) {
    if ( INTERSECTED != intersects[ 0 ].object ) {
      if ( INTERSECTED ) {
        INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
        bars[intersectedId].hideLabel();
      }
      INTERSECTED = intersects[ 0 ].object;
      INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
      INTERSECTED.material.emissive.setHex( 
              parseInt( bars[intersects[0].object.barid].darklumcolor, 16 ) );
      bars[intersects[0].object.barid].showLabel( actCoord.x, actCoord.y );
      intersectedId = intersects[0].object.barid;
    }
  } else {
    if ( INTERSECTED ) {
      INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
      bars[intersectedId].hideLabel();
    }
    intersectedId = null;
    INTERSECTED = null;
  }

  renderer.render( scene, camera );

}

// finds geoposition
function findGeoPosition(lt,ln,r){
  var x = r * Math.cos(lt) * Math.sin(ln);
  var y = r * Math.sin(lt)
  var z = r * Math.cos(lt) * Math.cos(ln);
  return { x: Math.round(x), y:Math.round(y), z: Math.round(z) };
}

// Converts numeric degrees to radians
if (typeof(Number.prototype.toRad) === "undefined") {
  Number.prototype.toRad = function() {
    return this * Math.PI / 180;
  }
}