// ****************************************************************************
// sample data file for the bar charts
var schema = { cols: [
                   { name:"Data 1", color:"be6700" }, 
                   { name:"Data 2", color:"d0b500" }, 
                   { name:"Data 3", color:"61c900" },
                   { name:"Data 4", color:"ff3300" } 
                  ],
                  rows:[{name:"Row 1"}]
                }

var dataValues = [];

for( var i=0; i<schema.cols.length; i++ ){
  dataValues[i] = [];
  dataValues[i][0] = Math.floor((Math.random()*1000));
}