'use strict';

//this component will basically just toggle off/on the spinning of the walls
AFRAME.registerComponent('audiomars-effect', {
  schema: {
    duration: {type: 'number', default:20000.0},  //duration is in milliseconds
  },
  multiple: false, //do not allow multiple instances of this component on this entity
  init: function() {
    
    //get a local reference to our entities and set some property variables
    const Context_AF = this;
    
    Context_AF.audio = new Audio("/worlds/SC_Hub/assets/audio/Mars.wav");
    //Context_AF.entity.components.sound.stopSound();
    Context_AF.isPlaying     = false;
    Context_AF.robot      = document.querySelector('#robot');



    //var keyboardControls = el.components['keyboard-controls'];
    //keyboardControls.isPressed('KeyR');


    //var sceneEl = document.querySelector('a-scene');
    //let's add the basic animation to teh walls entity
    //note that it is not enabled initially
    
    
    
    //listen on click
    Context_AF.el.addEventListener('hitstart', function() {

      Context_AF.robot.setAttribute("visible",true);
      console.log(Context_AF.audio)
      //if(Context_AF.isPlaying == false){
      Context_AF.audio.play();
      //}else{
        //Context_AF.audio.sound.pauseSound();
      //}
        
     

      

      
    });

    Context_AF.el.addEventListener('hitend', function() {

      Context_AF.robot.setAttribute("visible",false);
      console.log(Context_AF.audio)
      //if(Context_AF.isPlaying == false){
      Context_AF.audio.pause();
      Context_AF.audio.currentTime = 0;
      //}else{
        //Context_AF.audio.sound.pauseSound();
      //}
        
     

      

      
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
