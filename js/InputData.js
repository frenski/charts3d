// *******************
// sample data file
var schema = { 
               cols: [ { name:"2010", color:"bd6600" }, 
                       { name:"2011", color:"cbb100" }, 
                       { name:"2012", color:"61c900" }, 
                     ],
               rows: [ { name: "Product 1" }, 
                       { name: "Product 2" },
                       { name: "Product 3" },
                       { name: "Product 4" },
                       { name: "Product 5" }
                     ]
             };
             
var dataValues = [];

for( var i=0; i<schema.cols.length; i++ ){
  dataValues[i] = [];
  for (var j=0; j<schema.rows.length; j++ ){
    dataValues[i][j] = Math.floor((Math.random()*1000));
  }
}