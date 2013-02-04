/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 NODE: {{systemname}}
 Author(s): {{author}}
 Original Node Author(s): {{original_author}}
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/

VVVV.Nodes.{{objectname}} = function(id, graph) {
  this.constructor(id, "{{systemname}}", graph);
  
  this.meta = {
    authors: [{{author}}],
    original_authors: [{{original_author}}],
    credits: [],
    compatibility_issues: []
  };
  
  this.auto_evaluate = {{auto_evaluate}};
  
  // input pins
{{input_pin_definitions}}

  // output pins
{{output_pin_definitions}}

  // invisible pins
{{hidden_pin_definitions}}
  
  // initialize() will be called after node creation
  this.initialize = function() {
    
  }

  // evaluate() will be called each frame
  // (if the input pins have changed, or the nodes is flagged as auto-evaluating)
  this.evaluate = function() {
    // to implement; maybe start with something like this:
    
    var maxSize = this.getMaxInputSliceCount();
    
    for (var i=0; i<maxSize; i++) {
{{pin_fetches}}

      // do something ...
      
{{pin_sets}}
    }
    
    // you also might want to do stuff like this:
{{misc}}
  }

}
VVVV.Nodes.{{objectname}}.prototype = new VVVV.Core.Node();