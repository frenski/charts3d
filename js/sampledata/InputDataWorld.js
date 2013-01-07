// ****************************************************************************
// sample data file for the bar charts
schema = { cols: [
                   { name:"Spain", color:"E28105" }, 
                   { name:"Portugal", color:"E28105" }, 
                   { name:"Germany", color:"E28105" },
                   { name:"France", color:"E28105" },
                   { name:"Ireland", color:"E28105" },
                   { name:"Italy", color:"E28105" },
                   { name:"Austria", color:"E28105" },
                   { name:"Slovakia", color:"E28105" },
                   { name:"Finland", color:"E28105" },
                   { name:"Estonia", color:"E28105" },
                   { name:"Luxembourg", color:"E28105" },
                   { name:"Belgium", color:"E28105" },
                   { name:"Netherlands", color:"E28105" },
                   { name:"Slovenia", color:"E28105" },
                   { name:"Greece", color:"E28105" },
                   { name:"Cyprus", color:"E28105" },
                   { name:"Malta", color:"E28105" }
                  ],
                  rows:[{name:"GDP per capita"}]
                }

dataValues = [];

for( var i=0; i<schema.cols.length; i++ ){
  dataValues[i] = [];
  dataValues[i][0] = Math.floor((Math.random()*1000));
}