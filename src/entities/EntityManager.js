class EntityManager {
  constructor() {
    this.entities = [];
  }

  addEntity(entity) {
    this.entities.push(entity);
  }

  update() {
    this.entities.forEach((entity) => entity.update());
  }
}

export default EntityManager;
