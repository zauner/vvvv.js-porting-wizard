


$(document).ready(function() {
  
  initVVVV('vvvv_js', 'full');
  
  $.ajax({
    url: 'nodelist.xml',
    async: false,
    dataType: 'text',
    success: function(response) {
      var $nodeList = $(response);
      $nodeList.find('node').each(function() {
        var systemname = $(this).attr('systemname');
        $nodeLink = $('<a href="#'+systemname+'" class="nodelink">'+systemname+'</a>');
        if (VVVV.NodeLibrary[systemname.toLowerCase()])
          $nodeLink.addClass("implemented");
        $('#nodelist').append($nodeLink);
      });
      
      var templateCode;
      $.ajax({
        url: 'template.tpl.js',
        async: false,
        dataType: 'text',
        success: function(r) {
          templateCode = r;
        }
      })
      
      function getDefaultValue(subtype) {
        var ret = '';
        var match = /(Integer|Real|Boolean)/.exec(subtype);
        if (match) {
          ret = 0.0;
          match = /Default is (.+)$/.exec(subtype);
          if (match) {
            ret = match[1];
          }
        }
        else if (/Color/.test(subtype)) {
          ret = "'1.0, 1.0, 1.0, 1.0'";
        }
        else if (/String/.test(subtype)) {
          ret = "'text'";
        }
        return ret;
      }
      
      $(window).bind('hashchange', function() {
        $('#nodeoptions').show();
        $('.syntax-container').show();
        var systemname = window.location.hash.substring(1);
        if (VVVV.NodeLibrary[systemname.toLowerCase()])
          $('#implemented_alert').show();
        else
          $('#implemented_alert').hide();
        var $node = $nodeList.find('node[systemname="'+systemname+'"]').first();
        $('#nodename').html(systemname);
        if ($node.attr('autoevaluate')>0)
          $('#auto_evaluate').attr('checked', 'checked');
        else
          $('#auto_evaluate').attr('checked', undefined);
        $('#pins').find('div').empty();
        $node.find('pin[direction="Input"]').each(function() {
          if ($(this).attr('name')!="")
            $('#pins #input').append('<input type="checkbox" class="pincheckbox code_option" name="'+$(this).attr('name')+'" checked="checked"/> '+$(this).attr('name')+'<br/>');
        });
        $node.find('pin[direction="Output"]').each(function() {
          if ($(this).attr('name')!="ID" && $(this).attr('name')!="")
            $('#pins #output').append('<input type="checkbox" class="pincheckbox code_option" name="'+$(this).attr('name')+'" checked="checked"/> '+$(this).attr('name')+'<br/>');
        });
        $node.find('pin[direction="Configuration"]').each(function() {
          if ($(this).attr('name')!="Descriptive Name")
            $('#pins #invisible').append('<input type="checkbox" class="pincheckbox code_option" name="'+$(this).attr('name')+'"/> '+$(this).attr('name')+'<br/>');
        });
        
        
        function buildTemplate() {
          $('.syntax-container').remove();
          $('body').append('<pre id="template" class="syntax javascript"></pre>')
          
          var tpl = templateCode;
          tpl = tpl.replace(/\{\{systemname\}\}/g, systemname);
          tpl = tpl.replace(/\{\{objectname\}\}/g, systemname.replace(/[\s\(\)]/g, ''));
          tpl = tpl.replace(/\{\{author\}\}/g, _($('#author').val().split(',')).map(function(a) { return "'"+a.trim()+"'" }).join(','));
          tpl = tpl.replace(/\{\{original_author\}\}/g, _($('#original_author').val().split(',')).map(function(a) { return "'"+a.trim()+"'" }).join(','));
          tpl = tpl.replace(/\{\{auto_evaluate\}\}/g, $('#auto_evaluate').is(':checked'));
          
          var inpins = [];
          var pinfetches = [];
          $node.find('pin[direction="Input"]').each(function() {
            if ($('.pincheckbox[name="'+$(this).attr('name')+'"]').is(':checked')) {
              var objectName = $(this).attr('name').replace(/\s/g, '').toLowerCase();
              var defaultValue = getDefaultValue($(this).attr('subtype'));
              inpins.push("  var "+objectName+"In = this.addInputPin('"+$(this).attr('name')+"', ["+defaultValue+"], this);")
              pinfetches.push("      var "+objectName+" = "+objectName+"In.getValue(i);");
            }
          });
          tpl = tpl.replace(/\{\{input_pin_definitions\}\}/g, inpins.join('\n'));
          tpl = tpl.replace(/\{\{pin_fetches\}\}/g, pinfetches.join('\n'));
          
          var outpins = [];
          var pinsets = [];
          var misc = '';
          $node.find('pin[direction="Output"]').each(function() {
            if ($('.pincheckbox[name="'+$(this).attr('name')+'"]').is(':checked')) {
              var objectName = $(this).attr('name').replace(/\s/g, '').toLowerCase();
              var defaultValue = getDefaultValue($(this).attr('subtype'));
              outpins.push("  var "+objectName+"Out = this.addOutputPin('"+$(this).attr('name')+"', ["+defaultValue+"], this);")
              defaultValue = defaultValue.length == 0 ? "undefined" : defaultValue;
              pinsets.push("      "+objectName+"Out.setValue(i, "+defaultValue+");");
              misc = objectName+"Out.setSliceCount(maxSize);"
            }
          });
          tpl = tpl.replace(/\{\{output_pin_definitions\}\}/g, outpins.join('\n'));
          tpl = tpl.replace(/\{\{pin_sets\}\}/g, pinsets.join('\n'));
          tpl = tpl.replace(/\{\{misc\}\}/g, misc);
          
          var invpins = [];
          $node.find('pin[direction="Configuration"]').each(function() {
            if ($('.pincheckbox[name="'+$(this).attr('name')+'"]').is(':checked')) {
              var objectName = $(this).attr('name').replace(/\s/g, '').toLowerCase()+"In";
              invpins.push("  var "+objectName+" = this.addInvisiblePin('"+$(this).attr('name')+"', [0.0], this);")
            }
          });
          tpl = tpl.replace(/\{\{hidden_pin_definitions\}\}/g, invpins.join('\n'));
          
          $('#template').text(tpl);
          $.syntax({});
        }
        buildTemplate();
        
        $('.code_option').unbind('change');
        $('.code_option').change(function() { buildTemplate() });
        
        $('.code_option').unbind('keyup');
        $('.code_option').keyup(function() { buildTemplate() });
        
        $('.code_option').unbind('click');
        $('.code_option').click(function() { buildTemplate() });
      });
    }
  })
})
