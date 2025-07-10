/**
 * Loads and updates custom plugins.
 */
class PluginManager {
  constructor() {
    this.plugins = [];
  }

  /**
   * Dynamically import and initialize a plugin.
   * @param {string} pluginPath
   */
  loadPlugin(pluginPath) {
    import(pluginPath).then((module) => {
      this.plugins.push(module.default);
      if (module.default.init) module.default.init();
    });
  }

  update() {
    this.plugins.forEach((plugin) => {
      if (plugin.update) plugin.update();
    });
  }
}

export default PluginManager;
