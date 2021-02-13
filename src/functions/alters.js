const yaml = require("js-yaml");
const path = require("path");
const { database_entry } = require("../../config");

function alter_scene(scene) {
  const code = scene.scene.split("-")[0];
  const berm = yaml.load(fs.readFileSync(path.join(database_entry, `\\${code}\\meta.yaml`), "utf-8"));
  berm.source = scene.source;
  for (let berm_scene of berm.scenes)
    if (berm_scene.time === scene.time) {
      berm_scene.orientation = scene.orientation;
      berm_scene.models = scene.models;
      berm_scene.roughness = scene.roughness;
      berm_scene.tags = scene.tags;
    }
  fs.writeFileSync(path.join(database_entry, `\\${code}\\meta.yaml`), yaml.dump(berm));
}

module.exports = { alter_scene };
