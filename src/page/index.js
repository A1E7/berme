const { ref } = Vue;
const fs = require("fs");
const yaml = require("js-yaml");
const { remote, ipcRenderer } = require("electron");
const { Menu, MenuItem } = remote;

const { bodies, model_tags, scene_tags } = require("../../config");
const { get_datamap } = require("../functions/get_datamap");
const { alter_scene } = require("../functions/alters");
const { scenes_contain_filter, scenes_equal_filter } = require("../functions/filters");

let scenes = ref(get_datamap("scene"));
let flag = false;

const active1 = ref(scenes.value[0]);
const active2 = ref(scenes.value[1]);

const clicks = {
  berm_left: (scene) => {
    {
      if (flag) active1.value = scene;
      else active2.value = scene;
      flag = !flag;
    }
  },
  berm_right: (e, scene, index) => {
    const menu = new Menu();
    const ab_subms = [];
    const bt_subms = [];
    const scene_subms = [];

    scene.models.map((model, m_index) => {
      const m_label = `${model.tob} ${model.name}`;
      const ms_item = { label: m_label, submenu: [] };
      const mt_item = { label: m_label, submenu: [] };
      bodies.map((body) => {
        ms_item.submenu.push({
          label: body,
          click: () => {
            scene.models[m_index].body = body;
            alter_scene(scene);
            scenes[index] = scene;
          },
        });
      });
      model_tags.map((model_tag) => {
        mt_item.submenu.push({
          label: model_tag,
          click: () => {
            scene.models[m_index].tags = Array.from(new Set(scene.models[m_index].tags.concat([model_tag])));
            alter_scene(scene);
            scenes[index] = scene;
          },
        });
      });

      ab_subms.push(ms_item);
      bt_subms.push(mt_item);
    });
    scene_tags.map((scene_tag) => {
      scene_subms.push({
        label: scene_tag,
        click: () => {
          scene.tags = Array.from(new Set(scene.tags.concat([tag])));
          alter_scene(scene);
          scenes[index] = scene;
        },
      });
    });

    rightClickPosition = { x: e.x, y: e.y };
    menu.append(new MenuItem({ label: "厂牌", submenu: [{ label: scene.source.brand === "" ? "无" : scene.source.brand }] }));
    menu.append(new MenuItem({ label: "标题", submenu: [{ label: scene.source.title === "" ? "无" : scene.source.title }] }));
    menu.append(new MenuItem({ label: "链接", submenu: [{ label: scene.source.link === "" ? "无" : scene.source.link }] }));
    menu.append(new MenuItem({ label: "设定身体", submenu: ab_subms }));
    menu.append(new MenuItem({ label: "身体标签", submenu: bt_subms }));
    menu.append(new MenuItem({ label: "场景标签", submenu: scene_subms }));
    menu.popup(remote.getCurrentWindow());
  },
  scene_tag_filter: (tag_name) => {
    scenes.value = scenes_contain_filter("tags", tag_name);
  },
  model_filter: (model_name) => {
    scenes.value = scenes_contain_filter("models", model_name, "name", true);
  },
  model_tag_filter: (model_tag) => {
    scenes.value = scenes_contain_filter("models", model_tag, "tags");
  },
  brand_filter: (brand) => {
    scenes.value = scenes_equal_filter("source.brand", brand);
  },
  orientation_filter: (orientation) => {
    scenes.value = scenes_equal_filter("orientation", orientation);
  },
  body_filter: (body) => {
    scenes.value = scenes_contain_filter("models", body, "body", true);
  },
  roughness_filter: (roughness) => {
    scenes.value = scenes_equal_filter("roughness", roughness);
  },
};

function random() {
  let r1 = Math.floor(scenes.value.length * Math.random());
  let r2 = Math.floor(scenes.value.length * Math.random());
  while (r1 === r2) r2 = Math.floor(scenes.value.length * Math.random());
  clicks.berm_left(scenes.value[r1]);
  clicks.berm_left(scenes.value[r2]);
}
random();

Vue.createApp({
  setup() {
    return {
      scenes,
      random,
      clicks,
      active1,
      active2,
    };
  },
}).mount("#app");
