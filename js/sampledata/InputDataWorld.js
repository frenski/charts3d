// ****************************************************************************
// sample data file for the bar charts
schema = { cols: [
                   { name:"Spain", color:"be6700" }, 
                   { name:"Portugal", color:"be6700" }, 
                   { name:"Germany", color:"be6700" },
                   { name:"France", color:"be6700" },
                   { name:"Ireland", color:"be6700" },
                   { name:"Italy", color:"be6700" },
                   { name:"Austria", color:"be6700" },
                   { name:"Slovakia", color:"be6700" },
                   { name:"Finland", color:"be6700" },
                   { name:"Estonia", color:"be6700" },
                   { name:"Luxembourg", color:"be6700" },
                   { name:"Belgium", color:"be6700" },
                   { name:"Netherlands", color:"be6700" },
                   { name:"Slovenia", color:"be6700" },
                   { name:"Greece", color:"be6700" },
                   { name:"Cyprus", color:"be6700" },
                   { name:"Malta", color:"be6700" }
                  ],
                  rows:[{name:"GDP per capita"}]
                }

dataValues = [];

for( var i=0; i<schema.cols.length; i++ ){
  dataValues[i] = [];
  dataValues[i][0] = Math.floor((Math.random()*1000));
}