<template>
  <div v-for="(prop, key) in layerProperties" :key="key" class="info">
      <span><i class="dot" :style="`background: ${prop.color}`"></i>{{ key }}</span>
      <strong>{{ prop.total }}</strong>
    </div>
    <div class="info total">
      <span>Totaal aantal vogelnesten op kaart:</span> 
      <strong>{{ total }}</strong>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { layerProperties } from './mapHelpers';

const store = useStore();
const total = computed(() => store.getters.getTotal)
</script>
