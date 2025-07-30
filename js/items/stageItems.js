import * as THREE from 'three';
import stageLightMat from '../mats/stage_light.js';
import spotlightMat from '../mats/stage_spotlight.js';
import speakerMat from '../mats/stage_speaker.js';
import microphoneMat from '../mats/stage_microphone.js';
import microphoneStandMat from '../mats/stage_microphoneStand.js';
import controlPanelMat from '../mats/stage_controlPanel.js';
import projectorMat from '../mats/stage_projector.js';
import tripodMat from '../mats/stage_tripod.js';

function applyShadows(obj){
  obj.traverse(child=>{ if(child.isMesh){child.castShadow=true; child.receiveShadow=true;} });
}

export async function createStageLight(assetManager){
  const group=new THREE.Group();
  const mat=await stageLightMat(assetManager);
  const body=new THREE.Mesh(new THREE.CylinderGeometry(0.15,0.15,0.4,12), mat);
  body.rotation.x=Math.PI/2; group.add(body);
  applyShadows(group); return group;
}

export async function createSpotlight(assetManager){
  const group=new THREE.Group();
  const mat=await spotlightMat(assetManager);
  const housing=new THREE.Mesh(new THREE.CylinderGeometry(0.1,0.2,0.5,12), mat);
  housing.rotation.x=Math.PI/2; group.add(housing);
  applyShadows(group); return group;
}

export async function createStageSpeaker(assetManager){
  const group=new THREE.Group();
  const mat=await speakerMat(assetManager);
  const box=new THREE.Mesh(new THREE.BoxGeometry(0.6,0.9,0.5), mat);
  box.position.y=0.45; group.add(box);
  applyShadows(group); return group;
}

export async function createMicrophone(assetManager){
  const group=new THREE.Group();
  const mat=await microphoneMat(assetManager);
  const head=new THREE.Mesh(new THREE.SphereGeometry(0.06,8,8), mat);
  head.position.y=0.28; group.add(head);
  const handle=new THREE.Mesh(new THREE.CylinderGeometry(0.025,0.03,0.25,8), mat);
  handle.position.y=0.125; group.add(handle);
  applyShadows(group); return group;
}

export async function createMicrophoneStand(assetManager){
  const group=new THREE.Group();
  const standMat=await microphoneStandMat(assetManager);
  const tripod=await tripodMat(assetManager);
  const base=new THREE.Mesh(new THREE.CylinderGeometry(0.05,0.05,1.2,12), standMat);
  base.position.y=0.6; group.add(base);
  const legs=new THREE.Mesh(new THREE.ConeGeometry(0.5,0.05,3), standMat);
  legs.position.y=0; legs.rotation.x=Math.PI; group.add(legs);
  group.add(tripod); // simple placeholder tripod
  const mic=await createMicrophone(assetManager);
  mic.position.y=1.2; group.add(mic);
  applyShadows(group); return group;
}

export async function createControlPanel(assetManager){
  const group=new THREE.Group();
  const mat=await controlPanelMat(assetManager);
  const body=new THREE.Mesh(new THREE.BoxGeometry(1,0.5,0.6), mat);
  body.position.y=0.25; group.add(body);
  applyShadows(group); return group;
}

export async function createProjector(assetManager){
  const group=new THREE.Group();
  const mat=await projectorMat(assetManager);
  const body=new THREE.Mesh(new THREE.BoxGeometry(0.5,0.2,0.4), mat);
  body.position.y=0.1; group.add(body);
  applyShadows(group); return group;
}
