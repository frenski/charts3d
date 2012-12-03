// ****************************************************************************
// sample data file for the bar charts
var schema = { cols: [
                   { name:"Tourism", color:"a55900" }, 
                   { name:"Industry", color:"a18c00" }, 
                   { name:"Agriculture", color:"5d8300" },
                   { name:"Services", color:"cc2901" } 
                  ],
                  rows:[{name:"Row 1"}]
                }

var dataValues = [];

for( var i=0; i<schema.cols.length; i++ ){
  dataValues[i] = [];
  dataValues[i][0] = Math.floor((Math.random()*1000));
}