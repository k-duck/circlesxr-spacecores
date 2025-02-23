'use strict';

//this component will basically just toggle off/on the spinning of the walls
AFRAME.registerComponent('venus-effect', {
  schema: {
    duration: {type: 'number', default:20000.0},  //duration is in milliseconds
  },
  multiple: false, //do not allow multiple instances of this component on this entity
  init: function() {
    
    //get a local reference to our entities and set some property variables
    const Context_AF = this;
    
    Context_AF.venusLocator      = document.querySelector('#universal_VenusLocator');
    Context_AF.venus      = document.querySelector('#venus');
    Context_AF.box      = document.querySelector('#box-venus');
    Context_AF.isSpinning = false;
    
    //let's add the basic animation to teh walls entity
    //note that it is not enabled initially
    
    Context_AF.venus.setAttribute('animation', {property:'rotation.y', to:360, loop:true, dur:Context_AF.data.duration, easing:'linear', enabled:false});
    Context_AF.venusLocator.setAttribute('animation', {property:'rotation.y', to:360, loop:true, dur:Context_AF.data.duration, easing:'linear', enabled:false});
    
    //listen on click
    Context_AF.el.addEventListener('click', function() {
      if (Context_AF.isSpinning == true) {
        Context_AF.venus.setAttribute("visible",false);
        console.log('stop spinning');
        console.log('hide mars')
        Context_AF.venus.setAttribute('animation', {enabled:false});
        Context_AF.venusLocator.setAttribute('animation', {enabled:false});
        Context_AF.isSpinning = false;
        Context_AF.box.setAttribute('material', "color:rgb(255, 255, 255)");
      }
      else {
        console.log('spinning');
        
        console.log('show mars')
        Context_AF.venus.setAttribute('animation', {enabled:true});
        Context_AF.venusLocator.setAttribute('animation', {enabled:true});
        Context_AF.isSpinning = true;
        Context_AF.venus.setAttribute("visible",true);
        Context_AF.box.setAttribute('material', "color:rgb(0, 255, 0)");
      }
    });
    
  },
  
  //component documentation: https://github.com/aframevr/aframe/blob/master/docs/core/component.md
  
  // update: function (oldData) {},
  // tick: function(time, timeDelta) {},
  // tock: function(time, timeDelta) {},
  // remove: function() {},
  // pause: function() {},
  // play: function() {},
  // updateScheme: function(data) {}
});
