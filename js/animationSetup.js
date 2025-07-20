import * as THREE from 'three';

export function setupAnimatedPlayer(model, idleClip, walkClip, runClip) {
    // Rename clips for easier access
    idleClip.name = 'idle';
    walkClip.name = 'walk';
    runClip.name = 'run';

    // Filter out rotation tracks from the idle animation to preserve player orientation
    /* @tweakable Set to false to allow the idle animation to control player rotation. */
    const removeIdleRotation = true;
    if (removeIdleRotation) {
        idleClip.tracks = idleClip.tracks.filter(track => !track.name.endsWith('.quaternion'));
    }

    model.animations = [idleClip, walkClip, runClip];

    const mixer = new THREE.AnimationMixer(model);
    const actions = {
        idle: mixer.clipAction(idleClip),
        walk: mixer.clipAction(walkClip),
        run: mixer.clipAction(runClip),
    };
    
    /* @tweakable The playback speed of the player animations. 1 is normal speed, 0.5 is half speed. */
    const animationTimeScale = 0.5;
    actions.idle.timeScale = animationTimeScale;
    actions.walk.timeScale = animationTimeScale;
    actions.run.timeScale = animationTimeScale;

    /* @tweakable Duration for fading between animations in seconds. */
    model.userData.animationFadeDuration = 0.3;

    actions.idle.play();

    // Set a rotation offset so the GLB faces the same direction as procedural models.
    // This is used by the controls system to align the model with its movement direction.
    /* @tweakable Rotation offset for the animated GLB player model in radians. Adjust this if the model faces the wrong direction. 0 means no offset, -Math.PI / 2 is -90 degrees. */
    const rotationOffset = 0; // Set to 0 to remove the initial rotation.
    // model.rotation.y = rotationOffset; // We no longer apply initial rotation here.
    model.userData.rotationOffset = rotationOffset;

    model.userData.mixer = mixer;
    model.userData.actions = actions;
    model.userData.isAnimatedGLB = true;

    return model;
}

export function setupAnimatedRobot(model, idleClip, walkClip, listenClip) {
    idleClip.name = 'idle';
    walkClip.name = 'walk';
    listenClip.name = 'listen';

    model.animations = [idleClip, walkClip, listenClip];

    const mixer = new THREE.AnimationMixer(model);
    const actions = {
        idle: mixer.clipAction(idleClip),
        walk: mixer.clipAction(walkClip),
        listen: mixer.clipAction(listenClip),
    };
    
    /* @tweakable Duration for fading between robot animations in seconds. */
    model.userData.animationFadeDuration = 0.4;

    actions.idle.play();

    /* @tweakable Rotation offset for the animated robot GLB model in radians. */
    const rotationOffset = 0;
    model.userData.rotationOffset = rotationOffset;

    model.userData.mixer = mixer;
    model.userData.actions = actions;
    model.userData.isAnimatedGLB = true;

    return model;
}

export function setupAnimatedChicken(model, idleClip, walkClip, runClip, alertClip, listenClip) {
    idleClip.name = 'idle';
    walkClip.name = 'walk';
    runClip.name = 'run';
    alertClip.name = 'alert';
    listenClip.name = 'listen';

    model.animations = [idleClip, walkClip, runClip, alertClip, listenClip];

    const mixer = new THREE.AnimationMixer(model);
    const actions = {
        idle: mixer.clipAction(idleClip),
        walk: mixer.clipAction(walkClip),
        run: mixer.clipAction(runClip),
        alert: mixer.clipAction(alertClip),
        listen: mixer.clipAction(listenClip),
    };
    
    /* @tweakable Duration for fading between chicken animations in seconds. */
    model.userData.animationFadeDuration = 0.4;
    actions.idle.play();

    /* @tweakable Rotation offset for the animated chicken GLB model in radians. */
    const rotationOffset = 0;
    model.userData.rotationOffset = rotationOffset;

    model.userData.mixer = mixer;
    model.userData.actions = actions;
    model.userData.isAnimatedGLB = true;

    return model;
}

export function setupAnimatedWireframe(model, idleClip, walkClip, runClip, listenClip) {
    idleClip.name = 'idle';
    walkClip.name = 'walk';
    runClip.name = 'run';
    listenClip.name = 'listen';

    model.animations = [idleClip, walkClip, runClip, listenClip];

    const mixer = new THREE.AnimationMixer(model);
    const actions = {
        idle: mixer.clipAction(idleClip),
        walk: mixer.clipAction(walkClip),
        run: mixer.clipAction(runClip),
        listen: mixer.clipAction(listenClip),
    };
    
    /* @tweakable Duration for fading between wireframe animations in seconds. */
    model.userData.animationFadeDuration = 0.4;
    actions.idle.play();

    /* @tweakable Rotation offset for the animated wireframe GLB model in radians. */
    const rotationOffset = 0;
    model.userData.rotationOffset = rotationOffset;

    model.userData.mixer = mixer;
    model.userData.actions = actions;
    model.userData.isAnimatedGLB = true;

    return model;
}

export function setupAnimatedAlien(model, idleClip, walkClip, runClip, listenClip) {
    idleClip.name = 'idle';
    walkClip.name = 'walk';
    runClip.name = 'run';
    listenClip.name = 'listen';

    model.animations = [idleClip, walkClip, runClip, listenClip];

    const mixer = new THREE.AnimationMixer(model);
    const actions = {
        idle: mixer.clipAction(idleClip),
        walk: mixer.clipAction(walkClip),
        run: mixer.clipAction(runClip),
        listen: mixer.clipAction(listenClip),
    };
    
    /* @tweakable Duration for fading between alien animations in seconds. */
    model.userData.animationFadeDuration = 0.4;
    actions.idle.play();

    /* @tweakable Rotation offset for the animated alien GLB model in radians. */
    const rotationOffset = 0;
    model.userData.rotationOffset = rotationOffset;

    model.userData.mixer = mixer;
    model.userData.actions = actions;
    model.userData.isAnimatedGLB = true;

    return model;
}

export function setupAnimatedShopkeeper(model, idleClip, walkClip, listenClip) {
    idleClip.name = 'idle';
    walkClip.name = 'walk';
    listenClip.name = 'listen';

    model.animations = [idleClip, walkClip, listenClip];

    const mixer = new THREE.AnimationMixer(model);
    const actions = {
        idle: mixer.clipAction(idleClip),
        walk: mixer.clipAction(walkClip),
        listen: mixer.clipAction(listenClip),
    };
    
    /* @tweakable Duration for fading between shopkeeper animations in seconds. */
    model.userData.animationFadeDuration = 0.4;
    actions.idle.play();

    /* @tweakable Rotation offset for the animated shopkeeper GLB model in radians. */
    const rotationOffset = 0;
    model.userData.rotationOffset = rotationOffset;

    model.userData.mixer = mixer;
    model.userData.actions = actions;
    model.userData.isAnimatedGLB = true;

    return model;
}

export function setupAnimatedOgre(model, idleClip, walkClip, runClip, listenClip) {
    idleClip.name = 'idle';
    walkClip.name = 'walk';
    runClip.name = 'run';
    listenClip.name = 'listen';

    model.animations = [idleClip, walkClip, runClip, listenClip];

    const mixer = new THREE.AnimationMixer(model);
    const actions = {
        idle: mixer.clipAction(idleClip),
        walk: mixer.clipAction(walkClip),
        run: mixer.clipAction(runClip),
        listen: mixer.clipAction(listenClip),
    };
    
    /* @tweakable Duration for fading between ogre animations in seconds. */
    model.userData.animationFadeDuration = 0.4;
    actions.idle.play();

    /* @tweakable Rotation offset for the animated ogre GLB model in radians. */
    const rotationOffset = 0;
    model.userData.rotationOffset = rotationOffset;

    model.userData.mixer = mixer;
    model.userData.actions = actions;
    model.userData.isAnimatedGLB = true;

    return model;
}

export function setupEyebot(model) {
    model.userData.isEyebot = true;
    model.userData.isAnimatedGLB = false; // It is not using baked animations
    
    /* @tweakable Rotation offset for the eyebot GLB model in radians. */
    const rotationOffset = 0;
    model.userData.rotationOffset = rotationOffset;

    /* @tweakable Enables bobbing animation for the eyebot. */
    const enableBobbing = true;
    /* @tweakable Speed of the eyebot's bobbing animation. */
    const bobSpeed = 2;
    /* @tweakable Amplitude of the eyebot's bobbing animation. */
    const bobAmplitude = 0.1;
    
    /* @tweakable Enables aimless spinning animation for the eyebot. Set to false to allow directional movement. */
    const enableSpinning = false;
    /* @tweakable Speed of the eyebot's spinning animation. */
    const spinSpeed = 0.5;

    const initialRotationY = model.rotation.y;

    if (enableBobbing || enableSpinning) {
        // base Y position needs to be set when spawned
        model.userData.updateAnimations = (time) => {
            if (enableBobbing && model.userData.baseY) {
                 model.position.y = model.userData.baseY + (Math.sin(time * bobSpeed) * bobAmplitude);
            }
            if (enableSpinning) {
                model.rotation.y = initialRotationY + time * spinSpeed;
            }
        };
    }
    
    return model;
}