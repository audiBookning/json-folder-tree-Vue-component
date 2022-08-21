<script setup lang="ts">
import { reactive } from "vue";
import { JsonTreeView } from "./components";
import { ItemData } from "./types";

const obj = {
  string: "text",
  number: 123,
  boolean: true,
  array1: [{ nodeId: "value1" }, { nodeId: "value2" }, { nodeId: "value3" }],
  array2: ["A", "B", "C"],
  object: { prop1: "value1", nestedObject: { prop2: "value2" } },
};

const state = reactive({
  json: JSON.stringify(obj),
});

function onSelected(event: unknown) {
  console.log(event);
}
function openSelected(event: Partial<ItemData>) {
  console.log(event);
}
</script>

<template>
  <div class="theme-light">
    <JsonTreeView
      rootKey="root"
      colorScheme="light"
      arrayKey="nodeId"
      :folderFlag="true"
      :data="state.json"
      :maxDepth="2"
      @selected="onSelected"
      @toggleOpen="openSelected"
    />
  </div>
  <div class="theme-dark">
    <JsonTreeView
      colorScheme="dark"
      :data="state.json"
      @selected="onSelected"
      @toggleOpen="openSelected"
    />
  </div>
</template>

<style lang="scss" scoped>
@import "./../public/fonts/fonts.css";
//
.theme-light {
  background-color: #ffffff;
}
.theme-dark {
  background-color: #000000;
}
</style>
