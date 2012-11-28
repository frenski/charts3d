(function($) {
  $.fn.tableSheet = function(options) {
    
    // Getting the table and tbody params
    var table = $(this);
    table.append('<tbody></tbody>');
    var tbody = table.children('tbody');
    
    // initializing the number of rows
    var rows = 1;
    var cols = 1;
    
    // gets the parameters
    var opts = $.extend({}, $.fn.tableSheet.defaults, options);
    
    // the namespace
    nspace = opts.namespace
    
    // adds first rows and columns
    tbody.append('<tr><td class="rowcol" style="padding:0">'+
                  '<div class="addremove" style="text-align:right;"><img id="'+nspace+
                              'addCol" src="img/add2.png"><br>'+
                              '<img id="'+nspace+'remCol" src="img/rem1.png"></div>'+
                              '<div style="clear:both;"></div>'+
                              '<div class="addremove" style="margin-top:0"><img id="'+nspace+
                              'addRow" src="img/add1.png"><img id="'+nspace+
                              'remRow" src="img/rem2.png"></div>'+
                  '</td><td class="rowcol" id="'+nspace+
                  'col0"><input id="colorpick0" type="text" size="1"'+
                  'value="ae00e6" /> <span>Column 1</span></td></tr>'+
                  '<tr id="'+nspace+'row0"><td class="rowcol" id="">'+
                  'Row 1</td>'+
                  '<td id="'+nspace+'cell0_0" class="cell">0</td></tr>');
                  
    // adds the add/remove and export button
    // table.css("float", "left");
    // table.after('<div class="addremove" style="float:left; margin-left:-14px;"><img id="'+nspace+
    //             'addCol" src="img/add2.png"><br>'+
    //             '<img id="'+nspace+'remCol" src="img/rem1.png"></div>'+
    //             '<div style="clear:both;"></div>'+
    //             '<div class="addremove" style="margin-top:0"><img id="'+nspace+
    //             'addRow" src="img/add1.png"><img id="'+nspace+
    //             'remRow" src="img/rem2.png"></div>'+
    //             '<div style="height:20px">&nbsp;</div>'+
    //             '<div id="'+nspace+'exportbut" class="exportbut">'+
    //             opts.exportText+'</div>');
  
    table.after('<div style="height:20px">&nbsp;</div>'+
                '<div id="'+nspace+'exportbut" class="exportbut">'+
                opts.exportText+'</div>');
             
    // binds the click events
    $('#'+nspace+'addCol').click(function(){ addColumn(); });
    $('#'+nspace+'addRow').click(function(){ addRow(); });
    $('#'+nspace+'remCol').click(function(){ removeColumn(); });
    $('#'+nspace+'remRow').click(function(){ removeRow(); });
    $('#'+nspace+'exportbut').click(function(){ exportData(); });
    
    // function for adding a collumn
    var addColumn = function () {
      // Adds the header column to the tbody
      tbody.children('tr:first')
           .children('td#'+nspace+'col'+(cols-1))
           .after('<td class="rowcol" id="'+nspace+'col'+cols+'">'+
           '<input id="colorpick'+cols+
           '" type="text" size="1" value="'+randomHexNum()+'" />'+
           ' <span>Column '+(cols+1)+'</span></td>');
      // adds the color picker function
      addColPick ( $( '#colorpick'+cols ) );
      // adds the text editing plugin
      addJeditable ( $('#'+nspace+'col'+cols).children('span'), 'string' );
      for ( var i=0; i<rows; i++ ){
          tbody.children('tr#'+nspace+'row'+i)
               .append('<td class="cell" id="'+nspace+'cell'+cols+'_'+i+'">0</td>');
          addJeditable ( $('#'+nspace+'cell'+cols+'_'+i), 'float' );
        }
      cols ++;
    };
    
    // function for adding a row
    var addRow = function () {
      // apends every row and column to the table
      var html = '<tr id="'+nspace+'row'+rows+'"><td class="rowcol">Row '
                  +(rows+1)+'</td>';
      for ( var i=0; i<cols; i++ ){
          html += '<td class="cell" id="'+nspace+'cell'+i+'_'+rows+'">0</td>';
        }
      html += '</tr>';
      tbody.append(html);
      // adds the plugins - jeditable and color pickur
      addJeditable ( $('#'+nspace+'row'+rows).children('td:first'), 'string' );
      
      for ( var i=0; i<cols; i++ ){
        addJeditable ( $('#'+nspace+'cell'+i+'_'+rows), 'float' );
      }
      rows ++;
    };
    
    // function for removing a row
    var removeRow = function () {
      if( rows > 1 ){
        rows--;
        tbody.children('tr:last').remove();
      }
    };
    
    // function for removing a column
    var removeColumn = function () {
      if( cols > 1 ){
        cols--;
        tbody.children('tr:first').children('#'+nspace+'col'+cols).remove();
        for ( var i=0; i<rows; i++ ){
          tbody.children('tr#'+nspace+'row'+i).children('td:last').remove();
        }
      }
    }
    
    var addJeditable = function ( el, type ) {
      el.editable(function(value, settings) { 
          if( type == 'float' ){
            value = parseFloat(value);
            if ( isNaN (value) ) value = 0;
          }
          return ( value );
       }, { 
          type    : 'text',
          onblur  : 'submit' 
      });
    }
    
    var addColPick = function ( el, type ){
      el.colorpicker({
      		parts: ['swatches'],
      		showOn: 'button',
      		showCloseButton: true,
      		buttonColorize: true,
      		showNoneButton: false,
      		alpha: true,
      		buttonImage: 'css/images/ui-colorpicker.png',
      });
      el.hide();
    }
    
    var exportData = function (){
      var schema = { cols:[], rows: []};
      var data = [];
      
      // exporting the column data and the values
      for ( var i=0; i<cols; i++ ){
        schema.cols[i] = {};
        schema.cols[i].name = tbody.children('tr:first').
                              children('td#'+nspace+'col'+i).
                              children('span').html();
        schema.cols[i].color =tbody.children('tr:first').
                              children('td#'+nspace+'col'+i).
                              children('input#colorpick'+i).val();
        // exporting the values
        data[i] = [];
        for( var j=0; j<rows; j++ ){
          data[i][j] = parseFloat($('#'+nspace+'cell'+i+'_'+j).html());
        }
      }
     
      
      // exporting the row data
      for( var i=0; i<rows; i++){
        schema.rows[i] = {};
        schema.rows[i].name = tbody.children('tr#'+nspace+'row'+i).
                              children('td').html();
      }
      
      if(opts.exportCall!=''){
        opts.exportCall( {schema: schema, data: data} );
      }
    }
    
    var randomHexNum = function () {
      return (Math.random()*0xFFFFFF<<0).toString(16);
    }
    
    // Adds jeditable to the first element
    addJeditable ( $('#'+nspace+'col0').children('span'), 'string' );
    addJeditable ( $('#'+nspace+'row0').children('td:first'), 'string' );
    addJeditable ( $('#'+nspace+'cell0_0'), 'float' );
    
    // Adds the color picker elements
    addColPick ( $( '#colorpick0' ) );
  

  }
  //Default configuration:
  $.fn.tableSheet.defaults = {
    addColText : 'column: ',
    addRowText : 'row: ',
    namespace: 'jtsheet_',
    exportText: 'Export',
    exportCall: ''
  };

  })(jQuery);