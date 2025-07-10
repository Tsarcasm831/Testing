import * as CANNON from 'cannon-es';

const world = new CANNON.World();
world.gravity.set(0, -9.81, 0);

const applyPhysics = (entity, delta) => {
  if (!entity.body) {
    entity.body = new CANNON.Body({
      mass: entity.mass || 0,
      position: new CANNON.Vec3(entity.position.x, entity.position.y, entity.position.z),
    });
    entity.body.addShape(new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)));
    world.addBody(entity.body);
  }

  world.step(delta);
  entity.position.copy(entity.body.position);
  if (entity.mesh) entity.mesh.position.copy(entity.position);
};

export default applyPhysics;
