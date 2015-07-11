// $(form).completeness({
//   elements : [
//     {
//       element: $(ele1),
//       weight: 0.4,
//       evaluate: function(){
//         //this is element
//         // return weight between 0 and 1
//       },
//       {
        
//       },
//       {
        
//       }
//     }
//   ],
//   calculateOn: "blur",
//   onchange: function(){
    
//   }
// })

(function($, Factory){
  $.fn.completeness = function(options, callback){
    var returnData = null;

    this.each(function(){
      var element = $(this);
      var instance = element.data("completeness");
      if(options === "disable"){
        instance && instance.disable();
        callback && callback.call(this);
      } else if(options === "enable") {
        instance && instance.enable();
        callback && callback.call(this);
      } else if(!instance){
        instance = init(element, options);
        element.data('completeness', instance);
      } else {
        returnData = instance.calculateCompleteness();
      }
    });
    returnData = returnData || this;
    return returnData;
  };
  
  function init(element, options){
    var factory = new Factory({
      onchange: completionChange(element, options)
    });

    $(options.elements).each(function(){
      var data = this;
      var listening_event = data.calculateOn || options.calculateOn;
      data.element.on(listening_event, (function(){
        var source = factory.addSource({
          currentValue: data.element,
          weight: data.weight,
          data: data.defaultData
        });

        return function(){
          var value = data.element.val();
          if(source.currentValue !== value){
            source.currentValue = value;
          } else {
            return;
          }
          var result = data.evaluate.call(this, extractValue(data.element));
          source.update(result);
        };
      })());
    });

    if(options.evaluateOnInit){
      factory.calculateCompleteness();
    }
    return factory
  };
  
  function extractValue($element){
    var value = $element.val().trim();
    var words = []
    if(value !== ""){
      words = value.split(" ");
    }
    return {
      value: value,
      words: words
    };
  };

  function completionChange(element, options){
    var callback = options.onchange || function(){};
    var togglePoints = options.togglePoints || [];
    return function(value){
      $.each(togglePoints, function(){
        if(value > this.between[0] && value <= this.between[1]){
          element.addClass(this.classname);
        } else{
          element.removeClass(this.classname);
        }
      });
      callback.call(element, value);
    };
  };

  $.fn.completeness.defaults = {
    elements: [],
    calculateOn: "blur"
  };
  
})(jQuery, function(options){
  var options = options || {};
  this.sources = [];
  this.onchange = options.onchange;
  this.completionScore = 0;
  this.disabled = false;
  if(options.sources){
    this.addSources(options.sources);
  }

  this.disable = function(){
    this.disabled = true;
  };

  this.enable = function(){
    this.disabled = false;
    this.calculateCompleteness(true);
  };
  
  this.addSources = function(sources){
    var that = this;
    $.each(sources, function(index, source){
      that.addSource(source);
    });
  };

  this.addSource = function(options){
    options = options || {};
    options.calculator = this;
    var source = new Source(options);
    this.sources.push(source);
    return source;
  };

  this.completeness = function(){
    var score = 0;
    var that = this;
    $.each(this.sources, function(index, source){
      if(source.data){
        score += source.data*source.weight;
      }
    });
    return score;
  };

  this.calculateCompleteness = function(forceCalculate){
    var newScore = this.completeness();
    newScore = +newScore.toFixed(2);
    if(this.completionScore !== newScore || forceCalculate){
      this.completionScore = newScore;
      if(this.onchange && !this.disabled){
        this.onchange.call(this, this.completionScore);
      }
    }
  };

  var Source = function(options){
    this.weight = options.weight;
    this.calculator = options.calculator;
    this.data = options.data;

    this.update = function(data){
      this.data = data;
      this.calculator.calculateCompleteness.call(this.calculator);
    };
  };
});
