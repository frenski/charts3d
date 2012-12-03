// ****************************************************************************
// sample data file for the bar charts
var sampleData = [ { name:"Data 1", color:"d17100", val:0 }, 
                   { name:"Data 2", color:"d9bd00", val:0 }, 
                   { name:"Data 3", color:"61c900", val:0 },
                   { name:"Data 4", color:"FF3300", val:0 } ];

for( var i=0; i<sampleData.length; i++ ){
  sampleData[i].val = Math.floor((Math.random()*1000));
}