const { fstat } = require("fs");
const { database_entry } = require("../../config");
const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

function get_meta(id) {
  try {
    return yaml.load(fs.readFileSync(path.join(database_entry, `\\${id}\\meta.yaml`), "utf-8"));
  } catch (e) {
    return {};
  }
}

// scene or moment
function get_datamap(map_type) {
  const maps = [];
  const ids = fs.readdirSync(path.resolve(database_entry)).filter((value) => parseInt(value));
  ids.map((id) => {
    const meta = get_meta(id);
    map_type === "moment" &&
      meta.monents.map((moment) => {
        maps.push({ id: id, moment: moment });
      });
    map_type === "scene" &&
      meta.scenes.map((scene, index) => {
        const scene_item = {
          scene: `${id}-${index + 1}`,
          type: meta.type,
          time: scene.time,
          roughness: scene.roughness,
          orientation: scene.orientation,
          source: meta.source,
          models: scene.models,
          tags: scene.tags,
        };
        scene_item[meta.type] = fs.readdirSync(path.join(database_entry, `/${id}/${meta.type}`)).map((filename) => {
          return path.join(database_entry, `/${id}/${meta.type}`, filename);
        });
        scene_item.posters = fs
          .readdirSync(path.join(database_entry, `/${id}/poster`))
          .sort((a, b) => {
            parseInt(a.split("-")[1].split(".")[0]) - parseInt(b.split("-")[1].split(".")[0]);
          })
          .map((filename) => {
            return path.join(database_entry, `/${id}/poster/`, filename);
          });
        maps.push(scene_item);
      });
  });
  return maps;
}

module.exports = { get_datamap };
