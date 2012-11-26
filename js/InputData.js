// *******************
// sample data file
var schema = { 
               cols: [ { name:"Sprint", color:"ae00e6" }, 
                       { name:"Summer", color:"cbb100" }, 
                       { name:"Autumn", color:"61c900" }, 
                       { name:"Winter", color:"00c2d3" }
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