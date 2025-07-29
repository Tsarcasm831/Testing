import * as THREE from 'three';
import woodMat from '../mats/struct_wood.js';
import steelMat from '../mats/struct_steel.js';
import concreteMat from '../mats/struct_concrete.js';
import brickMat from '../mats/struct_brick.js';
import plasterMat from '../mats/int_plaster.js';
import hardwoodMat from '../mats/int_hardwood.js';
import ceramicTileMat from '../mats/int_ceramicTile.js';
import carpetMat from '../mats/int_carpet.js';
import glassMat from '../mats/wall_glass.js';

function applyShadows(obj){
  obj.traverse(child=>{ if(child.isMesh){child.castShadow=true; child.receiveShadow=true;}});
}

export async function createWoodChair(assetManager){
  const group=new THREE.Group();
  const mat = await woodMat(assetManager);
  const seat=new THREE.Mesh(new THREE.BoxGeometry(0.6,0.05,0.6), mat);
  seat.position.y=0.45; group.add(seat);
  const back=new THREE.Mesh(new THREE.BoxGeometry(0.6,0.8,0.05), mat);
  back.position.set(0,0.85,-0.275); group.add(back);
  const legGeo=new THREE.BoxGeometry(0.05,0.45,0.05);
  const legPos=[[-0.25,0.225,-0.25],[0.25,0.225,-0.25],[-0.25,0.225,0.25],[0.25,0.225,0.25]];
  legPos.forEach(p=>{const m=new THREE.Mesh(legGeo, mat); m.position.set(...p); group.add(m);});
  applyShadows(group); return group;
}

export async function createRoundTable(assetManager){
  const group=new THREE.Group();
  const mat = await woodMat(assetManager);
  const top=new THREE.Mesh(new THREE.CylinderGeometry(0.7,0.7,0.05,16), mat);
  top.position.y=0.75; group.add(top);
  const leg=new THREE.Mesh(new THREE.CylinderGeometry(0.1,0.15,0.7,12), mat);
  leg.position.y=0.35; group.add(leg);
  const base=new THREE.Mesh(new THREE.CylinderGeometry(0.4,0.4,0.05,12), mat);
  base.position.y=0.025; group.add(base);
  applyShadows(group); return group;
}

export async function createBed(assetManager){
  const group=new THREE.Group();
  const woodMaterial = await woodMat(assetManager);
  const carpetMaterial = await carpetMat(assetManager);
  const frame=new THREE.Mesh(new THREE.BoxGeometry(2,0.3,1), woodMaterial);
  frame.position.y=0.15; group.add(frame);
  const mattress=new THREE.Mesh(new THREE.BoxGeometry(1.9,0.25,0.9), carpetMaterial);
  mattress.position.y=0.4; group.add(mattress);
  const headboard=new THREE.Mesh(new THREE.BoxGeometry(2,0.8,0.1), woodMaterial);
  headboard.position.set(0,0.65,-0.45); group.add(headboard);
  applyShadows(group); return group;
}

export async function createBookshelf(assetManager){
  const group=new THREE.Group();
  const mat = await woodMat(assetManager);
  const frame=new THREE.Mesh(new THREE.BoxGeometry(1,1.6,0.3), mat);
  frame.position.y=0.8; group.add(frame);
  const shelfGeo=new THREE.BoxGeometry(0.9,0.05,0.25);
  for(let i=0;i<4;i++){
    const shelf=new THREE.Mesh(shelfGeo, mat);
    shelf.position.set(0,0.2+0.4*i,0); group.add(shelf);
  }
  applyShadows(group); return group;
}

export async function createKitchenCounter(assetManager){
  const group=new THREE.Group();
  const woodMaterial = await woodMat(assetManager);
  const tileMaterial = await ceramicTileMat(assetManager);
  const base=new THREE.Mesh(new THREE.BoxGeometry(1.5,0.8,0.6), woodMaterial);
  base.position.y=0.4; group.add(base);
  const top=new THREE.Mesh(new THREE.BoxGeometry(1.6,0.05,0.7), tileMaterial);
  top.position.y=0.825; group.add(top);
  applyShadows(group); return group;
}

export async function createStove(assetManager){
  const group=new THREE.Group();
  const mat = await steelMat(assetManager);
  const body=new THREE.Mesh(new THREE.BoxGeometry(0.9,0.8,0.6), mat);
  body.position.y=0.4; group.add(body);
  const top=new THREE.Mesh(new THREE.BoxGeometry(0.9,0.05,0.6), mat);
  top.position.y=0.825; group.add(top);
  applyShadows(group); return group;
}

export async function createRefrigerator(assetManager){
  const group=new THREE.Group();
  const mat = await steelMat(assetManager);
  const body=new THREE.Mesh(new THREE.BoxGeometry(0.9,1.8,0.8), mat);
  body.position.y=0.9; group.add(body);
  applyShadows(group); return group;
}

export async function createSink(assetManager){
  const group=new THREE.Group();
  const tileMaterial = await ceramicTileMat(assetManager);
  const concreteMaterial = await concreteMat(assetManager);
  const basin=new THREE.Mesh(new THREE.BoxGeometry(0.6,0.2,0.5), tileMaterial);
  basin.position.y=0.35; group.add(basin);
  const stand=new THREE.Mesh(new THREE.CylinderGeometry(0.15,0.2,0.7,12), concreteMaterial);
  stand.position.y=0.15; group.add(stand);
  applyShadows(group); return group;
}

export async function createSofa(assetManager){
  const group=new THREE.Group();
  const mat = await carpetMat(assetManager);
  const base=new THREE.Mesh(new THREE.BoxGeometry(2,0.3,0.8), mat);
  base.position.y=0.15; group.add(base);
  const back=new THREE.Mesh(new THREE.BoxGeometry(2,0.7,0.2), mat);
  back.position.set(0,0.55,-0.3); group.add(back);
  const armGeo=new THREE.BoxGeometry(0.2,0.6,0.8);
  const leftArm=new THREE.Mesh(armGeo, mat);
  leftArm.position.set(-0.9,0.45,0); group.add(leftArm);
  const rightArm=new THREE.Mesh(armGeo, mat);
  rightArm.position.set(0.9,0.45,0); group.add(rightArm);
  applyShadows(group); return group;
}

export async function createCoffeeTable(assetManager){
  const group=new THREE.Group();
  const mat = await woodMat(assetManager);
  const top=new THREE.Mesh(new THREE.BoxGeometry(1,0.05,0.6), mat);
  top.position.y=0.45; group.add(top);
  const legGeo=new THREE.BoxGeometry(0.05,0.4,0.05);
  const pos=[[-0.45,0.2,-0.25],[0.45,0.2,-0.25],[-0.45,0.2,0.25],[0.45,0.2,0.25]];
  pos.forEach(p=>{const leg=new THREE.Mesh(legGeo, mat); leg.position.set(...p); group.add(leg);});
  applyShadows(group); return group;
}

export async function createDesk(assetManager){
  const group=new THREE.Group();
  const mat = await woodMat(assetManager);
  const top=new THREE.Mesh(new THREE.BoxGeometry(1.2,0.05,0.6), mat);
  top.position.y=0.75; group.add(top);
  const legGeo=new THREE.BoxGeometry(0.05,0.7,0.05);
  const pos=[[-0.55,0.35,-0.25],[0.55,0.35,-0.25],[-0.55,0.35,0.25],[0.55,0.35,0.25]];
  pos.forEach(p=>{const leg=new THREE.Mesh(legGeo, mat); leg.position.set(...p); group.add(leg);});
  applyShadows(group); return group;
}

export async function createCabinet(assetManager){
  const group=new THREE.Group();
  const mat = await woodMat(assetManager);
  const body=new THREE.Mesh(new THREE.BoxGeometry(1,1.2,0.4), mat);
  body.position.y=0.6; group.add(body);
  applyShadows(group); return group;
}

export async function createWardrobe(assetManager){
  const group=new THREE.Group();
  const mat = await woodMat(assetManager);
  const body=new THREE.Mesh(new THREE.BoxGeometry(1.2,2,0.6), mat);
  body.position.y=1; group.add(body);
  applyShadows(group); return group;
}

export async function createDiningTable(assetManager){
  const group=new THREE.Group();
  const mat = await woodMat(assetManager);
  const top=new THREE.Mesh(new THREE.BoxGeometry(2,0.05,1), mat);
  top.position.y=0.8; group.add(top);
  const legGeo=new THREE.BoxGeometry(0.1,0.75,0.1);
  const pos=[[-0.9,0.375,-0.4],[0.9,0.375,-0.4],[-0.9,0.375,0.4],[0.9,0.375,0.4]];
  pos.forEach(p=>{const leg=new THREE.Mesh(legGeo, mat); leg.position.set(...p); group.add(leg);});
  applyShadows(group); return group;
}

export async function createNightstand(assetManager){
  const group=new THREE.Group();
  const mat = await woodMat(assetManager);
  const body=new THREE.Mesh(new THREE.BoxGeometry(0.6,0.6,0.4), mat);
  body.position.y=0.3; group.add(body);
  const top=new THREE.Mesh(new THREE.BoxGeometry(0.65,0.05,0.45), mat);
  top.position.y=0.625; group.add(top);
  applyShadows(group); return group;
}

export async function createBathtub(assetManager){
  const group=new THREE.Group();
  const mat = await ceramicTileMat(assetManager);
  const tub=new THREE.Mesh(new THREE.BoxGeometry(1.6,0.5,0.7), mat);
  tub.position.y=0.25; group.add(tub);
  applyShadows(group); return group;
}

export async function createToilet(assetManager){
  const group=new THREE.Group();
  const mat = await ceramicTileMat(assetManager);
  const base=new THREE.Mesh(new THREE.CylinderGeometry(0.25,0.3,0.4,12), mat);
  base.position.y=0.2; group.add(base);
  const tank=new THREE.Mesh(new THREE.BoxGeometry(0.5,0.4,0.2), mat);
  tank.position.set(0,0.6,-0.05); group.add(tank);
  const seat=new THREE.Mesh(new THREE.TorusGeometry(0.25,0.05,8,16), mat);
  seat.rotation.x=Math.PI/2; seat.position.y=0.4; group.add(seat);
  applyShadows(group); return group;
}

export async function createFloorLamp(assetManager){
  const group=new THREE.Group();
  const steelMaterial = await steelMat(assetManager);
  const plasterMaterial = await plasterMat(assetManager);
  const base=new THREE.Mesh(new THREE.CylinderGeometry(0.15,0.2,0.05,12), steelMaterial);
  base.position.y=0.025; group.add(base);
  const pole=new THREE.Mesh(new THREE.CylinderGeometry(0.05,0.05,1.5,12), steelMaterial);
  pole.position.y=0.8; group.add(pole);
  const shade=new THREE.Mesh(new THREE.ConeGeometry(0.3,0.4,12), plasterMaterial);
  shade.position.y=1.55; shade.rotation.x=Math.PI; group.add(shade);
  applyShadows(group); return group;
}

export async function createCeilingFan(assetManager){
  const group=new THREE.Group();
  const steelMaterial = await steelMat(assetManager);
  const woodMaterial = await woodMat(assetManager);
  const base=new THREE.Mesh(new THREE.CylinderGeometry(0.05,0.05,0.3,12), steelMaterial);
  base.position.y=-0.15; group.add(base);
  const hub=new THREE.Mesh(new THREE.CylinderGeometry(0.1,0.1,0.1,12), steelMaterial);
  hub.position.y=0; group.add(hub);
  const bladeGeo=new THREE.BoxGeometry(0.8,0.02,0.15);
  for(let i=0;i<4;i++){
    const blade=new THREE.Mesh(bladeGeo, woodMaterial);
    blade.position.y=0; blade.rotation.y=i*Math.PI/2; blade.position.x=0.4*Math.sin(i*Math.PI/2); blade.position.z=0.4*Math.cos(i*Math.PI/2);
    group.add(blade);
  }
  applyShadows(group); return group;
}

export async function createTVStand(assetManager){
  const group=new THREE.Group();
  const mat = await woodMat(assetManager);
  const body=new THREE.Mesh(new THREE.BoxGeometry(1.2,0.6,0.4), mat);
  body.position.y=0.3; group.add(body);
  const top=new THREE.Mesh(new THREE.BoxGeometry(1.25,0.05,0.45), mat);
  top.position.y=0.625; group.add(top);
  applyShadows(group); return group;
}

export async function createRug(assetManager){
  const group=new THREE.Group();
  const mat = await carpetMat(assetManager);
  const rug=new THREE.Mesh(new THREE.PlaneGeometry(2,1.5), mat);
  rug.rotation.x=-Math.PI/2; rug.receiveShadow=true; group.add(rug);
  return group;
}
export async function createWindowFrame(assetManager){
  const group=new THREE.Group();
  const woodMaterial = await woodMat(assetManager);
  const glassMaterial = await glassMat(assetManager);
  const frame=new THREE.Mesh(new THREE.BoxGeometry(1.2,1.2,0.1), woodMaterial);
  frame.position.y=0.6; group.add(frame);
  const glass=new THREE.Mesh(new THREE.PlaneGeometry(1,1), glassMaterial);
  glass.position.set(0,0.6,0.055); group.add(glass);
  applyShadows(group); return group;
}

export async function createDoorFrame(assetManager){
  const group=new THREE.Group();
  const mat = await woodMat(assetManager);
  const frame=new THREE.Mesh(new THREE.BoxGeometry(1,2,0.1), mat);
  frame.position.y=1; group.add(frame);
  applyShadows(group); return group;
}

export async function createStorageCrate(assetManager){
  const group=new THREE.Group();
  const mat = await brickMat(assetManager);
  const box=new THREE.Mesh(new THREE.BoxGeometry(0.8,0.8,0.8), mat);
  box.position.y=0.4; group.add(box);
  applyShadows(group); return group;
}

export async function createFlowerPot(assetManager){
  const group=new THREE.Group();
  const brickMaterial = await brickMat(assetManager);
  const concreteMaterial = await concreteMat(assetManager);
  const woodMaterial = await woodMat(assetManager);
  const plasterMaterial = await plasterMat(assetManager);
  const pot=new THREE.Mesh(new THREE.CylinderGeometry(0.25,0.3,0.3,12), brickMaterial);
  pot.position.y=0.15; group.add(pot);
  const soil=new THREE.Mesh(new THREE.CylinderGeometry(0.24,0.24,0.1,12), concreteMaterial);
  soil.position.y=0.25; group.add(soil);
  const stem=new THREE.Mesh(new THREE.CylinderGeometry(0.02,0.02,0.3,8), woodMaterial);
  stem.position.y=0.4; group.add(stem);
  const bloom=new THREE.Mesh(new THREE.SphereGeometry(0.1,8,8), plasterMaterial);
  bloom.position.y=0.6; group.add(bloom);
  applyShadows(group); return group;
}