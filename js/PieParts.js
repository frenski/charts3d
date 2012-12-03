/**
 * a class for the Bar objects - @author Yane Frenski
 */

PiePart = function( val, totalval, angprev, color,  valcolor , pos) {
  //the 3D cube object
  this.pieobj = null;
  
  // the 3D object for the text label
  this.labelobj = null
  
  // should it have a label
  this.hasLabel = true;
  
  // the position (usually 0;0;0)
  this.position = pos;
  
  // the radius size 
  this.radius = 300;
  
  // the previous angle - this one should start from it
  this.angPrev = angprev;
  
  // value and Totam
  this.val = val;
  this.valTotal = totalval;
  
  // main cube colour
  // this.color = parseInt(color,16);
  // this.lumcolor = colorLuminance( color, 0.5 );
  // this.darklumcolor = colorLuminance( color, -0.3 );
  // this.valcolor = parseInt(valcolor,16);
  
  // label vars
  this.labelSize = 50;
  this.labelHeight = 5;
  this.labelFont = "helvetiker";
  
  // function to add the bar to the scene and position it
  this.addPie = function( target ){
    
    // Material for the bars with transparency
    var material = new THREE.MeshPhongMaterial( {ambient: 0x000000,
                                                 color: this.color,
                                                 specular: 0x999999,
                                                 shininess: 100,
                                                 shading : THREE.SmoothShading,
                                                 transparent: true
                                                } );
    
    // Creats the shape, based on the value and the radius
    var shape = new THREE.Shape();
    shape.moveTo(0,0);
    shape.arc(0,0,pieRadius,this.angPrev,this.angPrev+
      (Math.PI*2*(this.val/this.valTotal)),false);
    shape.lineTo(0,0);
    nextAng = this.angPrev + Math.PI*2*(this.val/this.valTotal);

    var geometry = new THREE.ExtrudeGeometry( shape, extrudeOpts);

    this.pieobj = new THREE.Mesh( geometry, material );
    mesh.rotation.set(90,0,0);
                                          
    // Creating the 3D object, positioning it and adding it to the scene
    this.pieobj = new THREE.Mesh( geometry, material );
    this.pieobjmesh.rotation.set(90,0,0);
    this.pieobj.castShadow = true;
    this.pieobj.receiveShadow = true;
    target.add( this.pieobj );
    
    // If we want to have a label, we add a text object
    // if(this.hasLabel){
    //   
    //   var txt = this.val.toString();
    //   
    //   // Create a three.js text geometry
    //   var geometry = new THREE.TextGeometry( txt, {
    //     size: this.labelSize,
    //     height: this.labelHeight,
    //     curveSegments: 3,
    //     font: this.labelFont,
    //     weight: "bold",
    //     style: "normal",
    //     bevelEnabled: false
    //   });
    // 
    //   var material = new THREE.MeshPhongMaterial( { color: this.valcolor, 
    //                                                 shading: THREE.FlatShading } );
    //   
    //   // Positions the text and adds it to the scene
    //   this.labelobj = new THREE.Mesh( geometry, material );
    //   this.labelobj.position.y += (this.h/2) + 50;
    //   this.labelobj.position.x -= (this.labelSize*txt.length/3);
    //   this.labelobj.position.z += 50;
    //   this.labelobj.rotation.y = Math.PI/4;
    //   this.labelobj.castShadow = true;
    //   this.labelobj.receiveShadow = true;
    //   this.barobj.add( this.labelobj );
    //   
    //   // hides the label at the beginning
    //   this.hideLabel();
    //   
    // }
    
    return nextAng;
    
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