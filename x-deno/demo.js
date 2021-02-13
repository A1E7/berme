export {};
import {
  parse as parse_yaml,
  stringify as yaml_stringfy,
} from "https://deno.land/std@0.85.0/encoding/yaml.ts";

const database = [];
for (const code of Deno.readDirSync("D:/berms/database")) {
  const y_berm = parse_yaml(
    new TextDecoder("utf-8").decode(
      Deno.readFileSync(`D:/berms/database/${code.name}/meta.yaml`)
    )
  );
  database.push({ id: code.name, meta: y_berm });
  // Deno.writeFileSync(
  //   `D:/berms/database/${code.name}/meta.yaml`,
  //   new TextEncoder().encode(yaml_stringfy(y_berm))
  // );
}
const datamap = {
  orientations: [],
  scene_tags: [],
  body_tags: [],
  models: [],
  bodies: [],
  brands: [],
  roughness: [],
};
const all_scenes = database
  .map((berm) => {
    const obj = berm.meta.scenes;
    obj.id = berm.id;
    return obj;
  })
  .flat();

function getCount(arr, rank, ranktype) {
  var obj = {},
    k,
    arr1 = [];
  for (var i = 0, len = arr.length; i < len; i++) {
    k = arr[i];
    if (obj[k]) obj[k]++;
    else obj[k] = 1;
  }
  //保存结果{el-'元素'，count-出现次数}

  for (var o in obj) {
    arr1.push({ el: o, count: obj[o] });
  }

  //排序（降序）
  arr1.sort(function (n1, n2) {
    return n2.count - n1.count;
  });
  //如果ranktype为1，则为升序，反转数组
  if (ranktype === 1) arr1 = arr1.reverse();

  var rank1 = rank || arr1.length;
  return arr1.slice(0, rank1);
}

function wish() {
  database.map((berm) => {
    datamap.brands = datamap.brands.concat([berm.meta.source.brand]);
    berm.meta.scenes.map((scene) => {
      datamap.scene_tags = datamap.scene_tags.concat(scene.tags);
      datamap.orientations = datamap.orientations.concat([scene.orientation]);
      datamap.roughness = datamap.roughness.concat([scene.roughness]);
      scene.models.map((model) => {
        datamap.models.push(model.name);
        datamap.bodies.push(model.body);
        datamap.body_tags = datamap.body_tags.concat(model.tags);
      });
    });
  });
  for (const key in datamap) {
    datamap[key] = getCount(datamap[key]);
    datamap[key].map((item) => {
      item.ids = [];
      return item;
    });
  }
  database.map((berm) => {
    datamap.brands.map((brand, index) => {
      if (brand.el === berm.meta.source.brand)
        datamap.brands[index].ids.push(`${berm.id}`);
    });
    berm.meta.scenes.map((scene, scene_index) => {
      datamap.orientations.map((orientation, index) => {
        if (orientation.el === scene.orientation)
          datamap.orientations[index].ids.push(`${berm.id}-${scene_index + 1}`);
      });
      datamap.roughness.map((roughness, index) => {
        if (roughness.el === scene.roughness)
          datamap.roughness[index].ids.push(`${berm.id}-${scene_index + 1}`);
      });
      scene.tags.map((scene_tag) => {
        datamap.scene_tags.map((_scene_tag, index) => {
          if (_scene_tag.el === scene_tag)
            datamap.scene_tags[index].ids.push(`${berm.id}-${scene_index + 1}`);
        });
      });
      scene.models.map((model) => {
        datamap.bodies.map((body, index) => {
          if (body.el === model.body)
            datamap.bodies[index].ids.push(`${berm.id}-${scene_index + 1}`);
        });
        datamap.models.map((_model, index) => {
          if (_model.el === model.name)
            datamap.models[index].ids.push(`${berm.id}-${scene_index + 1}`);
        });
        model.tags.map((body_tag) => {
          datamap.body_tags.map((_body_tag, index) => {
            if (_body_tag.el === body_tag)
              datamap.body_tags[index].ids.push(
                `${berm.id}-${scene_index + 1}-${model.tob}-${model.name}`
              );
          });
        });
      });
    });
  });
  // for (const key in datamap) {
  //   datamap[key].map((item) => {
  //     item.ids = item.ids.join(",");
  //     return item;
  //   });
  // }
  console.log(datamap.body_tags);
  console.log(datamap.scene_tags);
}
console.clear();
setTimeout(() => {
  wish();
}, 100);
