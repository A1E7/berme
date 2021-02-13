const { get_datamap } = require("./get_datamap");

const scenes = get_datamap("scene");

// type
function scenes_equal_filter(type, name) {
  return scenes.filter((scene) => get_inner(type, scene) === name);
}

/**
 * tag tagname
 * objarray obj[key].name key
 * @param {string} type
 * @param {string} name
 * @param {string} object_inner_key
 */
function scenes_contain_filter(type, name, object_inner_key, equal) {
  return scenes.filter((scene) => {
    const object = get_inner(type, scene);
    if (!object_inner_key) return object.includes(name);
    let filtered;
    if (equal) filtered = object.filter((item) => item[object_inner_key] === name);
    else filtered = object.filter((item) => item[object_inner_key].includes(name));
    return filtered.length !== 0;
  });
}

function get_inner(key_string, object) {
  const keys = key_string.split(".");
  if (keys.length === 1) return object[keys[0]];
  let inner = object;
  for (let i = 0; i < keys.length; i++) inner = inner[keys[i]];
  return inner;
}

module.exports = {
  scenes_equal_filter,
  scenes_contain_filter,
};
