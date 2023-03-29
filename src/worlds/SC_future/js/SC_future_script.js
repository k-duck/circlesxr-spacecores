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
            }      
        });

        // Explosion element plays animations when other animations have been completed
        THISCOMP.explosion.addEventListener("animationcomplete", e => {
            console.log(e);
            if(e.detail.name == "animation__astExplosion1") {
                console.log("Made it!");
                THISCOMP.explosion.setAttribute("animation__astExplosion1", { enabled: false });
                THISCOMP.explosion.setAttribute("animation__astExplosion2", { enabled: true });
            }
            if(e.detail.name == "animation__astExplosion2") {
                THISCOMP.explosion.setAttribute("animation__astExplosion2", { enabled: false });
                THISCOMP.explosion.getObject3D("mesh").material.opacity = 0;
            }
        });
    }
});