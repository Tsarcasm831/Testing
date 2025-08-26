import * as THREE from 'three';

export function addObbProxy(scene, objectGrid, building) {
  building.updateWorldMatrix(true, false);

  const box = new THREE.Box3().setFromObject(building);
  const center = new THREE.Vector3();
  const size = new THREE.Vector3();
  box.getCenter(center);
  box.getSize(size);

  const quat = new THREE.Quaternion();
  building.getWorldQuaternion(quat);
  const euler = new THREE.Euler().setFromQuaternion(quat, 'YXZ');

  const proxy = new THREE.Object3D();
  proxy.position.set(center.x, 0, center.z);

  if (building.userData?.round && building.userData?.roundRadius) {
    const scl = new THREE.Vector3();
    building.matrixWorld.decompose(new THREE.Vector3(), new THREE.Quaternion(), scl);
    const avgXZ = (Math.abs(scl.x) + Math.abs(scl.z)) * 0.5;
    proxy.userData.collider = {
      type: 'sphere',
      radius: building.userData.roundRadius * avgXZ
    };
  } else {
    const hx = Math.max(2, size.x / 2);
    const hz = Math.max(2, size.z / 2);
    proxy.userData.collider = {
      type: 'obb',
      center: { x: center.x, z: center.z },
      halfExtents: { x: hx, z: hz },
      rotationY: euler.y
    };
  }

  proxy.userData.label = building.name || 'House';
  objectGrid.add(proxy);
  scene.add(proxy);
}
