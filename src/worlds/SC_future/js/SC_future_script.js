'use strict'

AFRAME.registerComponent('asteroid-activator', {
    init: function() {
        const THISCOMP = this;
        THISCOMP.asteroid = document.querySelector('#asteroid');

        // Stores the starting location of the asteroid
        let defaultAstPos = "78.74 25.46 -15.12";
        let defaultAstRot = "0 0 0";

        THISCOMP.astApproachSound = document.querySelector("#asteroidApproachingSound");
        THISCOMP.astImpactSound = document.querySelector("#asteroidImpactSound");

        // Animation for asteroid position applied to the asteroid.
        THISCOMP.asteroid.setAttribute('animation__astPos', { property: 'position', to: "7.004 8.351 -15.12", loop: false, dur: 5200,
                                                        easing: 'linear', enabled: false });
        THISCOMP.asteroid.setAttribute('animation__astRot', { property: 'rotation', to: "-23 284 0", loop: false, dur: 5200,
                                                        easing: 'linear', enabled: false });

        // Animation for the explosion is applied to the asteroidExplosion element
        THISCOMP.explosion = document.querySelector("#asteroidExplosion");

        // Explosion effect is made invisible at initiation
        THISCOMP.explosion.setAttribute("visible", false);
        THISCOMP.explosion.getObject3D("mesh").material.opacity = 0;

        // Animations for the explosion is applied to the asteroidExplosion element
        THISCOMP.explosion.setAttribute('animation__astExplosion1', { property: 'scale', to: '1.4 1.4 1.4', loop: false, dur: 600,
                                                        easing: 'easeOutQuad', enabled: false });
        THISCOMP.explosion.setAttribute('animation__astExplosion2', { property: 'scale', to: '0.01 0.01 0.01', loop: false, dur: 600,
                                                        easing: 'easeInQuad', enabled: false });
                                                        
        THISCOMP.el.addEventListener("mouseup", function() {
            THISCOMP.asteroid.setAttribute('animation__astPos', { enabled: true});
            THISCOMP.asteroid.setAttribute('animation__astRot', { enabled: true});
            // Asteroid Approaching sound is played
            THISCOMP.astApproachSound.components.sound.playSound();
        });

        // Detects if the asteroid animation has completed before resetting the position and rotation
        THISCOMP.asteroid.addEventListener("animationcomplete", e => {
            if(e.detail.name == "animation__astPos") {
                THISCOMP.asteroid.setAttribute("animation__astPos", { enabled: false });
                THISCOMP.asteroid.setAttribute("animation__astRot", { enabled: false });
                THISCOMP.asteroid.setAttribute("position", "78.74 25.46 -15.12");
                THISCOMP.asteroid.setAttribute("rotation", "0 0 0");
                // Asteroid Impact sound is played
                THISCOMP.astImpactSound.components.sound.playSound();
                // Event is emitted to activate explosion animation
                //THISCOMP.asteroid.emit('startAstExplosionAnim', null, false);
                THISCOMP.explosion.getObject3D("mesh").material.opacity = 1.0;
                THISCOMP.explosion.object3D.scale.set(0.01, 0.01, 0.01);
                THISCOMP.explosion.setAttribute("animation__astExplosion1", { enabled: true});
                THISCOMP.explosion.setAttribute("visible", true);
            }      
        });

        // Explosion element plays animations when other animations have been completed
        THISCOMP.explosion.addEventListener("animationcomplete", e => {
            console.log(e);
            if(e.detail.name == "animation__astExplosion1") {
                THISCOMP.explosion.setAttribute("animation__astExplosion1", { enabled: false });
                THISCOMP.explosion.setAttribute("animation__astExplosion2", { enabled: true });
            }
            if(e.detail.name == "animation__astExplosion2") {
                THISCOMP.explosion.setAttribute("animation__astExplosion2", { enabled: false });
                THISCOMP.explosion.getObject3D("mesh").material.opacity = 0;
                THISCOMP.explosion.setAttribute("visible", false);
            }
        });
    }
});

AFRAME.registerComponent('heat-dial', {
    init: function() {
        const THISCOMP = this;
        THISCOMP.heatDial = document.querySelector('#heatDial');
        THISCOMP.sun = document.querySelector('#sun');
        THISCOMP.earthHeat = document.querySelector('#earthHeat');
        THISCOMP.heatButtons = document.getElementsByClassName('heatButton');
        THISCOMP.heatLevel = 0;
        let newRotPos = null;

        // Size of the sun and opacity of glow effect is adjusted at component initialization
        THISCOMP.sun.object3D.scale.set(0.4, 0.4, 0.4);
        THISCOMP.earthHeat.getObject3D('mesh').material.opacity = 0;

        THISCOMP.heatIncrementEvent = "increaseHeat";

        THISCOMP.el.sceneEl.addEventListener(CIRCLES.EVENTS.WS_CONNECTED, function (data) {
            THISCOMP.socket = CIRCLES.getCirclesWebsocket();

            //Store heat buttons in an array and deduce which one was pressed by checking the classname. Events are emitted when they are pressed
            for (var i = 0; i < THISCOMP.heatButtons.length; i++) {
                THISCOMP.heatButtons[i].addEventListener("click", function(event) {
                    let selectedButton = event.target.className;
                    // Rotation for the heat dial is updated based on what heat button was pressed. Same with scale for the sun and opacity for the heat glow effect
                    if(selectedButton.includes("increase") && THISCOMP.heatLevel < 4) {
                        THISCOMP.heatLevel++;
                        THISCOMP.socket.emit(THISCOMP.heatIncrementEvent, {heat:THISCOMP.heatLevel , room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
                        console.log("Increase event");
                        newRotPos = 90 + (THISCOMP.heatLevel * 45);
                        THISCOMP.heatDial.object3D.rotation.set(THREE.MathUtils.degToRad(0), THREE.MathUtils.degToRad(newRotPos), THREE.MathUtils.degToRad(0));
                        THISCOMP.sun.object3D.scale.set(0.4 + (THISCOMP.heatLevel * 0.2), 0.4 + (THISCOMP.heatLevel * 0.2), 0.4 + (THISCOMP.heatLevel * 0.2));
                        THISCOMP.earthHeat.getObject3D('mesh').material.opacity = 0 + (THISCOMP.heatLevel * 0.25);
                    }
                    if(selectedButton.includes("decrease") && THISCOMP.heatLevel > 0) {
                        THISCOMP.heatLevel--;
                        THISCOMP.socket.emit(THISCOMP.heatIncrementEvent, {heat:THISCOMP.heatLevel , room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
                        console.log("Decrease event");
                        newRotPos = 90 + (THISCOMP.heatLevel * 45);
                        THISCOMP.heatDial.object3D.rotation.set(THREE.MathUtils.degToRad(0), THREE.MathUtils.degToRad(newRotPos), THREE.MathUtils.degToRad(0));
                        THISCOMP.sun.object3D.scale.set(0.4 + (THISCOMP.heatLevel * 0.2), 0.4 + (THISCOMP.heatLevel * 0.2), 0.4 + (THISCOMP.heatLevel * 0.2));
                        THISCOMP.earthHeat.getObject3D('mesh').material.opacity = 0 + (THISCOMP.heatLevel * 0.25);
                    }
                });

                // Listen for any other users pressing the heat buttons
                THISCOMP.socket.on(THISCOMP.heatIncrementEvent, function(data) {
                    console.log(data);
                    newRotPos = 90 + (data.heat * 45);
                    THISCOMP.heatDial.object3D.rotation.set(THREE.MathUtils.degToRad(0), THREE.MathUtils.degToRad(newRotPos), THREE.MathUtils.degToRad(0));
                    THISCOMP.sun.object3D.scale.set(0.4 + (data.heat * 0.2), 0.4 + (data.heat * 0.2), 0.4 + (data.heat * 0.2));
                    THISCOMP.earthHeat.getObject3D('mesh').material.opacity = 0 + (data.heat * 0.25);
                });
            }
        }

        //Store heat buttons in an array and deduce which one was pressed by checking the classname
        // for (var i = 0; i < THISCOMP.heatButtons.length; i++) {
        //     THISCOMP.heatButtons[i].addEventListener("click", function(event) {
        //         let selectedButton = event.target.className;
        //         // Rotation for the heat dial is updated based on what heat button was pressed. Same with scale for the sun and opacity for the heat glow effect
        //         if(selectedButton.includes("increase") && THISCOMP.heatLevel < 4) {
        //             THISCOMP.heatLevel++;
        //             newRotPos = 90 + (THISCOMP.heatLevel * 45);
        //             THISCOMP.heatDial.object3D.rotation.set(THREE.MathUtils.degToRad(0), THREE.MathUtils.degToRad(newRotPos), THREE.MathUtils.degToRad(0));
        //             THISCOMP.sun.object3D.scale.set(0.4 + (THISCOMP.heatLevel * 0.2), 0.4 + (THISCOMP.heatLevel * 0.2), 0.4 + (THISCOMP.heatLevel * 0.2));
        //             THISCOMP.earthHeat.getObject3D('mesh').material.opacity = 0 + (THISCOMP.heatLevel * 0.25);
        //         }
        //         if(selectedButton.includes("decrease") && THISCOMP.heatLevel > 0) {
        //             THISCOMP.heatLevel--;
        //             newRotPos = 90 + (THISCOMP.heatLevel * 45);
        //             THISCOMP.heatDial.object3D.rotation.set(THREE.MathUtils.degToRad(0), THREE.MathUtils.degToRad(newRotPos), THREE.MathUtils.degToRad(0));
        //             THISCOMP.sun.object3D.scale.set(0.4 + (THISCOMP.heatLevel * 0.2), 0.4 + (THISCOMP.heatLevel * 0.2), 0.4 + (THISCOMP.heatLevel * 0.2));
        //             THISCOMP.earthHeat.getObject3D('mesh').material.opacity = 0 + (THISCOMP.heatLevel * 0.25);
        //         }
        //     });
        // }
        
    )}
});