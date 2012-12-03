// *******************
// Util functions


// A function to calcuate lighter hex colour for the wireframe 
// courtesy of Craig Buckler:
// http://www.sitepoint.com/javascript-generate-lighter-darker-color/

function colorLuminance(hex, lum) {  
    // validate hex string  
    hex = String(hex).replace(/[^0-9a-f]/gi, '');  
    if (hex.length < 6) {  
        hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];  
    }
    lum = lum || 0;  
    // convert to decimal and change luminosity  
    var rgb = "", c, i;  
    for (i = 0; i < 3; i++) {  
        c = parseInt(hex.substr(i*2,2), 16);  
        c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);  
        rgb += ("00"+c).substr(c.length);  
    }
    return rgb;  
};


// Function for wrappin the text
// source: 
function wrapText( context, text, x, y, maxWidth, lineHeight, maxLineNum ) {
  var words = text.split(" ");
  var line = "";
  var lineNum = 0;
  for(var n = 0; n < words.length; n++) {
    var testLine = line + words[n] + " ";
    var metrics = context.measureText(testLine);
    var testWidth = metrics.width;
    if((testWidth > maxWidth)&&(lineNum<maxLineNum)) {
      context.fillText(line, x, y);
      line = words[n] + " ";
      y += lineHeight;
      lineNum++;
    }
    else {
      line = testLine;
    }
  }
  if(lineNum<=maxLineNum-1){
    context.fillText(line, x, y);
  }
};

// Function to get the max value in a 2-dimensional array
function getMaxArr(arr){
  var maxVal = arr[0][0];
  for( var i=0; i<arr.length; i++ ){
    for ( var j=0; j<arr[i].length; j++ ){
      if( arr[i][j] > maxVal) maxVal = arr[i][j];
    }
  }
  return maxVal;
}

// Function to get the max value in a 2-dimensional array
function getMinArr(arr){
  var minVal = arr[0][0];
  for( var i=0; i<arr.length; i++ ){
    for ( var j=0; j<arr[i].length; j++ ){
      if( arr[i][j] < minVal) minVal = arr[i][j];
    }
  }
  return minVal;
}

// Gets the closest rounding of the max value
function getRoundMax (val){
  
  var powsign = -1;
  if( val < 1 && val > -1){
    var roundRatio = 1;
  }else{
    var maxLength = val.toString().length;
    var roundRatio = Math.pow( 10, powsign*(maxLength-1) );
  }
  
  if( val > 0){
    return Math.ceil(val*roundRatio)/roundRatio;
  }else{
    return Math.round(val*roundRatio)/roundRatio;
  }
  
}

function getTotalArr(arr){
  var total = 0;
  for (var i = 0; i < arr.length; i++) {
    for (var j = 0; j < arr[i].length; j++) {
      if ( typeof arr[i][j] != 'number' ) arr[i][j] = 0;
      total += arr[i][j];
    }
  }
  return total;
}

// funciton to update the legend div - requires jQuery
function initLegend(el, schema){
  console.log("init legend");
  el.empty();
  for ( var i=0; i<schema.cols.length; i++){
    el.append('<div style="margin-right:5px; background-color:#'+
                schema.cols[i].color+'" class="div-legend-color left"></div>'+
               '<div class="left" style="margin-right:10px;">'+
                schema.cols[i].name+'</div>');
  }
  el.append ('<div class="clear"></div>');
}