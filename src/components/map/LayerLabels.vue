<template>
  <label v-for="(bird, key) in layerProps" :key="key" :style="setBackground(key)">{{ key }}
    <input type="checkbox" class="check" v-model="activeBirds" :value="key" />
  </label>
</template>

<script setup>
import { defineProps, ref, watch } from 'vue';
import { useStore } from 'vuex';

const props = defineProps({
  layerProps: {},
  birds: null
})
const store = useStore();
const activeBirds = ref([]);

watch(activeBirds, (n) => store.dispatch('updateActiveBirds', n))

function setBackground (label) {
  return activeBirds.value.includes(label) && `background: ${props.layerProps[label].color}`;
}
</script>
