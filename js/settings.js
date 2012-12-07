/**
 * a general settings script - @author Yane Frenski
 */

// table rows and cols maximum
var maxTableRows = 50;
var maxTableCols = 50;
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
// pie radius
var pieRadius = 750;
// the thickness of the pie
var pieHeight = 150;
// extrude options
var extrudeOpts = { amount: pieHeight, 
                    bevelEnabled: true, 
                    bevelSegments: 5, 
                    steps: 5 };

// init the schema and data array
var schema = { cols: [ { name: "Column 1", color:"ae00e6" }],
              rows: [ { name: "Row 1" } ] };
var dataValues = [[0]];

switch(chartType){
  case 'bar':
    break;
  case 'pie':
    maxTableRows = 1;
    break;
  case 'area':
    valHeight = 500;
    extrudeOpts = { amount: squareStep/4, 
                    bevelEnabled: true, 
                    bevelSegments: 5, 
                    steps: 5 };
    break;
  default:
    
  }