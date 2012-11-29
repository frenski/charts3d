/**
 * a class for the Bar objects - @author Yane Frenski
 */

BarCube = function( color, x, z, val ) {
  //the 3D cube object
  this.barobj = null;
  
  //the 3D stroke (wireframe object) object
  this.wfobj = null;
  
  // the 3D object for the text label
  this.labelobj = null
  
  // should we set the wireframe
  this.hasWireframe = true;
  
  // should it have a label
  this.hasLabel = true;
  
  // the square size (x and z)
  this.sqsize = 100;
  
  // position in the quadrant
  this.posx = x;
  this.posz = z;
  
  // value & height
  this.val = val;
  ratio = 
  this.h = ((val - minScaleVal)/scaleDif)*valHeight;
  if ( this.h==0 ) this.h = 0.5;
  
  // main cube colour
  this.color = parseInt(color,16);
  this.lumcolor = colorLuminance( color, 0.5 );
  this.darklumcolor = colorLuminance( color, -0.3 );
  
  // label vars
  this.labelSize = 50;
  this.labelHeight = 5;
  this.labelFont = "helvetiker";
  
  // function to add the bar to the scene and position it
  this.addBar = function( target ){
    
    // Simple cube geometry for the bar
    var geometry = new THREE.CubeGeometry( this.sqsize, this.h, this.sqsize );
    // Material for the bars with transparency
    var material = new THREE.MeshPhongMaterial( {ambient: 0x000000,
                                                 color: this.color,
                                                 specular: 0x999999,
                                                 shininess: 100,
                                                 shading : THREE.SmoothShading,
                                                 opacity:0.8,
                                                 transparent: true
                                                } );
                                                
    // Creating the 3D object, positioning it and adding it to the scene
    this.barobj = new THREE.Mesh( geometry, material );
    this.barobj.castShadow = true;
    this.barobj.receiveShadow = true;
    this.barobj.position.x = xDeviation + this.posx*squareStep + squareStep/2;
    this.barobj.position.y = yDeviation + this.h/2;
    this.barobj.position.z = zDeviation + this.posz*squareStep + squareStep/2;
    target.add( this.barobj );
    
    // If we want to have wireframe (with a lighter colour) we attach 2nd obj
    if(this.hasWireframe){
      
      // Creates cube with the same size
      var geometry = new THREE.CubeGeometry( this.sqsize, this.h, this.sqsize );
      
      // Generates a wireframe material
      var material = new THREE.MeshBasicMaterial( { 
                         color: parseInt( this.lumcolor, 16 ),
                         wireframe:true} );
      this.wfobj = new THREE.Mesh( geometry, material );
      this.wfobj.receiveShadow = true;
      
      // Adds the wireframe object to the main one
      this.barobj.add( this.wfobj );
    }
    
    // If we want to have a label, we add a text object
    if(this.hasLabel){
      
      var txt = this.val.toString();
      
      // Create a three.js text geometry
      var geometry = new THREE.TextGeometry( txt, {
        size: this.labelSize,
        height: this.labelHeight,
        curveSegments: 3,
        font: this.labelFont,
        weight: "bold",
        style: "normal",
        bevelEnabled: false
      });

      var material = new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.FlatShading } );
      
      // Positions the text and adds it to the scene
      this.labelobj = new THREE.Mesh( geometry, material );
      this.labelobj.position.y += (this.h/2) + 50;
      this.labelobj.position.x -= (this.labelSize*txt.length/3);
      this.labelobj.position.z += 50;
      this.labelobj.rotation.y = Math.PI/4;
      this.labelobj.castShadow = true;
      this.labelobj.receiveShadow = true;
      this.barobj.add( this.labelobj );
      
      // hides the label at the beginning
      this.hideLabel();
      
    }

  };
  
  // function to show the label
  this.showLabel = function(){
  
    if(this.hasLabel){
      this.labelobj.visible = true;
    }  
    
  };
  
  // function to hide the label
  this.hideLabel = function(){
  
    if(this.hasLabel){
      this.labelobj.visible = false;
    }  
    
  };
  
  
};