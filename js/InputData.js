// *******************
// sample data file
var schema = { 
               cols: [ { name:"Sprint", color:"ae00e6" }, 
                       { name:"Summer", color:"cbb100" }, 
                       { name:"Autumn", color:"61c900" }, 
                       { name:"Winter", color:"00c2d3" }
                     ],
               rows: ["Product 1", "Product 2", "Product 3", "Product 4", "Product 5"]
             };
             
var dataValues = [];

for( var i=0; i<schema.cols.length; i++ ){
  dataValues[i] = [];
  for (var j=0; j<schema.rows.length; j++ ){
    dataValues[i][j] = Math.floor((Math.random()*1500));
  }
}