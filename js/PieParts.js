/**
 * a class for the Bar objects - @author Yane Frenski
 */

PiePart = function( val, totalval, radius, angprev, pos, extrude, color, valcolor) {
  //the 3D cube object
  this.pieobj = null;
  
  // the 3D object for the text label
  this.labelobj = null
  
  // should it have a label
  this.hasLabel = true;
  
  // the position (usually 0;0;0)
  this.position = pos;
  
  // the radius size 
  this.radius = radius;
  
  // the previous angle - this one should start from it
  this.angPrev = angprev;
  
  // value and Totam
  this.val = val;
  this.valTotal = totalval;
  
  // extrude options
  this.extrudeOpts = extrude;
  
  // main cube colour
  this.color = parseInt(color,16);
  this.valcolor = parseInt(valcolor,16);
  this.lumcolor = colorLuminance( color, 0.5 );
  this.darklumcolor = colorLuminance( color, -0.5 );
  
  // label vars
  this.labelSize = 60;
  this.labelHeight = 6;
  this.labelFont = "helvetiker";
  
  // function to add the bar to the scene and position it
  this.addPie = function( target ){
    
    // Material for the bars with transparency
    var material = new THREE.MeshPhongMaterial( {ambient: 0x000000,
                                                 color: this.color,
                                                 specular: 0x777777,
                                                 shininess: 100,
                                                 shading : THREE.SmoothShading,
                                                 transparent: true
                                                } );
    
    // Creats the shape, based on the value and the radius
    var shape = new THREE.Shape();
    var angToMove = (Math.PI*2*(this.val/this.valTotal))
    shape.moveTo(this.position.x,this.position.y);
    shape.arc(this.position.x,this.position.y,pieRadius,this.angPrev,
              this.angPrev+angToMove,false);
    shape.lineTo(this.position.x,this.position.y);
    nextAng = this.angPrev + angToMove;

    var geometry = new THREE.ExtrudeGeometry( shape, this.extrudeOpts );

    this.pieobj = new THREE.Mesh( geometry, material );
    this.pieobj.rotation.set(90,0,0);
                                          
    // Creating the 3D object, positioning it and adding it to the scene
    this.pieobj = new THREE.Mesh( geometry, material );
    this.pieobj.rotation.set(Math.PI/2,0,0);
    this.pieobj.castShadow = true;
    this.pieobj.receiveShadow = true;
    target.add( this.pieobj );
    
    // If we want to have a label, we add a text object
    if(this.hasLabel){
      
      var percent = Math.round( (this.val/this.valTotal*100) * 10 ) / 10;
      var txt = this.val.toString() + " (" +
                percent.toString() +"%)";
      
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
    
      var material = new THREE.MeshPhongMaterial( { color: this.valcolor, 
                                                    shading: THREE.FlatShading } );
      
      // calculates the positon of the text
      this.valcolor = parseInt(valcolor,16);
      var txtAng = this.angPrev + angToMove/2;
      var txtRad = this.radius * 0.8;
      
      
      // Positions the text and adds it to the scene
      this.labelobj = new THREE.Mesh( geometry, material );
      this.labelobj.position.z += this.extrudeOpts.amount - this.labelSize *3;
      this.labelobj.position.x = txtRad * Math.cos(txtAng);
      this.labelobj.position.y = txtRad * Math.sin(txtAng);
      this.labelobj.rotation.set(3*Math.PI/2,0,0);
      this.labelobj.castShadow = true;
      this.labelobj.receiveShadow = true;
      this.pieobj.add( this.labelobj );
      
      // hides the label at the beginning
      this.hideLabel();
      
    }
    
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