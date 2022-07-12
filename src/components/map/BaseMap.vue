<template>
  <header>
    <h2>Vogelbroedplaatsen in Amsterdam</h2>
  </header>
  <nav>
    <LayerLabels :layerProps="layerProps" :birds="birds" />
  </nav>
  <section class="map-container">
    <div id="map" />
  </section>
  <footer class="footer">
    <MapTotals />
  </footer>
</template>
<script setup>
import { useStore } from 'vuex';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { onMounted, inject, ref, computed, watch } from 'vue';
import { layerProperties } from './mapHelpers';
import LayerLabels from './LayerLabels';
import MapTotals from './MapTotals';

const store = useStore();
const axios = inject('axios');
const url = 'https://maps.amsterdam.nl/open_geodata/geojson_lnglat.php?KAARTLAAG=VOGELS&THEMA=vogels';
let map;
const birds = ref(new Set());
const layerProps = ref(layerProperties);
const data = computed(() => store.getters.getData)
const activeBirds = computed(() => store.getters.getActiveBirds);

watch(activeBirds, (n) => {
  for (const bird of birds.value) {
    if (map.getLayer(bird)) {
      map.setLayoutProperty(bird, 'visibility', (n.includes(bird) || !n.length) ? 'visible' : 'none');
    }
  }
})

onMounted(async () => {
  mapboxgl.accessToken = 'pk.eyJ1IjoiZWRqYSIsImEiOiJjbDR6aGd4cDgwa2JiM3B1bDZ3NmgzaGpsIn0.oET3mVlFz2tbZDeJVBIrFg';
  map = new mapboxgl.Map({
    container: "map",
    style: 'mapbox://styles/mapbox/light-v10', //streets-v11',
    center: [4.901157, 52.370217],
    zoom: 11
  });
  
  const api = await axios.get(url);
  api.data.features.map(f => !/overig/i.test(f.properties.Vogel) && birds.value.add(f.properties.Vogel));
  store.dispatch('updateData', api.data)

  setMap();
})

function setMap() {
  map.addSource('birds', {
    type: 'geojson',
    data: data.value
  });
    
  map.on('load', () => {
    for (const bird of birds.value) {
      map.addLayer({
        id: bird,
        type: 'circle',
        source: 'birds',
        paint: {
          'circle-radius': 3,
          'circle-color': layerProps.value[bird].color,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#fff'
        }
      })
      map.setFilter(bird, ['==', ['get', 'Vogel'], bird]);
    }
  });

  map.on('idle', () => {
    for (const bird of birds.value) {
      layerProps.value[bird].total = map.queryRenderedFeatures({layers: [bird] }).length;
    }

    store.dispatch('updateTotals', layerProps.value )
    const total = map.queryRenderedFeatures({layers: Array.from(birds.value) }).length
    store.dispatch('updateTotal', total )
  })
}


</script>
<style lang="scss">
@import "@/assets/styles.scss";
</style>
