<script setup lang="ts">
import { computed, reactive, onBeforeMount } from "vue";
import { then, when } from "switch-ts";
import { ItemData, SelectedData, ValueTypes, ItemType } from "../types";

// NOTE: Vue cannot use type interfaces in defineProps
// if they are in an imported file...
// NOTE: the interface marks the not required property with ?
export interface ItemProps {
  data: ItemData;
  key?: string;
  folder?: boolean;
  maxDepth?: number;
  canSelect?: boolean;
}

const props = withDefaults(defineProps<ItemProps>(), {
  maxDepth: 1,
  canSelect: false,
  folder: false,
});

const emit = defineEmits(["selected", "toggleOpen"]);

const state = reactive({
  open: false,
});

onBeforeMount(() => {
  // @ts-ignore
  if (props.data) state.open = props.data.depth < props!.maxDepth;
});

function toggleOpen(data: Partial<ItemData>): void {
  state.open = !state.open;
  if (props.data.type === ItemType.OBJECT) {
    emit("toggleOpen", {
      key: data.key,
      value: data.value,
      children: data.children,
      path: data.path,
    } as SelectedData);
  }
}

function onClick(data: Partial<ItemData>): void {
  emit("selected", {
    key: data.key,
    value: data.value,
    path: data.path,
  } as SelectedData);
}

function bubbleSelected(data: Partial<ItemData>): void {
  emit("selected", data);
}

const openSelected = (data: Partial<ItemData>): void => {
  emit("toggleOpen", data);
};

function getKey(itemData: ItemData): string {
  const keyValue = Number(itemData.key);
  return !isNaN(keyValue) ? `${itemData.key}":` : `"${itemData.key}":`;
}

function getValueColor(value: ValueTypes): string {
  return when(typeof value)
    .is((v) => v === "string", then("var(--jtv-string-color)"))
    .is((v) => v === "number", then("var(--jtv-number-color)"))
    .is((v) => v === "bigint", then("var(--jtv-number-color)"))
    .is((v) => v === "boolean", then("var(--jtv-boolean-color)"))
    .is((v) => v === "object", then("var(--jtv-null-color)"))
    .is((v) => v === "undefined", then("var(--jtv-null-color)"))
    .default(then("var(--jtv-valueKey-color)"));
}

const classes = computed((): unknown => {
  return {
    "chevron-arrow": true,
    opened: state.open,
  };
});

const googleIcon = computed((): unknown => {
  return when(props.data.type)
    .is((v) => v === ItemType.ARRAY && !state.open, then("folder"))
    .is((v) => v === ItemType.ARRAY && state.open, then("folder_open"))
    .is((v) => v === ItemType.OBJECT && !state.open, then("note_add"))
    .is((v) => v === ItemType.OBJECT && state.open, then("description"))
    .default(then("var(--jtv-valueKey-color)"));
});

const valueClasses = computed((): unknown => {
  return {
    "value-key": true,
    "can-select": props.canSelect,
  };
});

const lengthString = computed((): string => {
  let length = props.data?.length || 0;

  if (props.data?.type === ItemType.ARRAY) {
    return length === 1 ? `${length} element` : `${length} elements`;
  }
  return length === 1 ? `${length} property` : `${length} properties`;
});

const dataValue = computed((): string =>
  props.data.value === undefined
    ? "undefined"
    : JSON.stringify(props.data.value)
);
//
</script>

<template>
  <div class="json-view-item">
    <div v-if="data.type === ItemType.OBJECT || data.type === ItemType.ARRAY">
      <button
        class="data-key"
        :aria-expanded="state.open ? 'true' : 'false'"
        @click.stop="toggleOpen(data)"
      >
        <div :class="classes"></div>
        <span v-if="folder" class="material-symbols-outlined">{{
          googleIcon
        }}</span>

        {{ data.key }}:
        <span class="properties">{{ lengthString }}</span>
      </button>
      <JsonTreeViewItem
        v-if="state.open"
        v-for="child in data.children"
        :key="getKey(child)"
        :data="child"
        :folder="folder"
        :maxDepth="maxDepth"
        :canSelect="canSelect"
        @selected="bubbleSelected"
        @toggleOpen="openSelected"
      />
    </div>
    <div
      v-if="data.type === ItemType.VALUE"
      :class="valueClasses"
      :role="canSelect ? 'button' : undefined"
      :tabindex="canSelect ? '0' : undefined"
      @click="onClick(data)"
      @keyup.enter="onClick(data)"
      @keyup.space="onClick(data)"
    >
      <span class="value-key">{{ data.key }}:</span>
      <span :style="{ color: getValueColor(data.value) }">
        {{ dataValue }}
      </span>
    </div>
  </div>
</template>

<style lang="scss">
.json-view-item:not(.root-item) {
  margin-left: 15px;
}
.value-key {
  color: var(--jtv-valueKey-color);
  font-weight: 600;
  margin-left: 10px;
  border-radius: 2px;
  white-space: nowrap;
  padding: 5px 5px 5px 10px;
  &.can-select {
    cursor: pointer;
    &:hover {
      background-color: rgba(0, 0, 0, 0.08);
    }
    &:focus {
      outline: 2px solid var(--jtv-hover-color);
    }
  }
}
.data-key {
  font-size: 100%;
  font-family: inherit;
  border: 0;
  background-color: transparent;
  width: 100%;
  color: var(--jtv-key-color);
  display: flex;
  align-items: center;
  border-radius: 2px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  padding: 5px;
  &:hover {
    background-color: var(--jtv-hover-color);
  }
  &:focus {
    outline: 2px solid var(--jtv-hover-color);
  }
  &::-moz-focus-inner {
    border: 0;
  }
  .properties {
    font-weight: 300;
    opacity: 0.9;
    margin-left: 4px;
    user-select: none;
  }
}
.chevron-arrow {
  flex-shrink: 0;
  border-right: 2px solid var(--jtv-arrow-color);
  border-bottom: 2px solid var(--jtv-arrow-color);
  width: var(--jtv-arrow-size);
  height: var(--jtv-arrow-size);
  margin-right: 20px;
  margin-left: 5px;
  transform: rotate(-45deg);
  &.opened {
    margin-top: -3px;
    transform: rotate(45deg);
  }
}
</style>
