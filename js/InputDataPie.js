// ****************************************************************************
// sample data file for the bar charts
var schema = { cols: [
                   { name:"Data 1", color:"d17100" }, 
                   { name:"Data 2", color:"d9bd00" }, 
                   { name:"Data 3", color:"61c900" },
                   { name:"Data 4", color:"FF3300" } 
                  ],
                  rows:[]
                }

var dataValues = [];

for( var i=0; i<schema.cols.length; i++ ){
  dataValues[i] = [];
  dataValues[i][0] = Math.floor((Math.random()*100));
}