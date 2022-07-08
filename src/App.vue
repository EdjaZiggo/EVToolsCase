<template>
  <button v-for="(bird, index) in Array.from(birds)" :key="index" @click="birdLayers">{{ bird }}</button>
  <div id="map" />
  <!-- <router-view /> -->
</template>
<script>
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import { onMounted, inject, ref } from 'vue';

export default {
  setup() {
    const axios = inject('axios');
    const url = 'https://maps.amsterdam.nl/open_geodata/geojson_lnglat.php?KAARTLAAG=VOGELS&THEMA=vogels';
    const birds = ref(new Set());
    
    
    function birdLayers(event) {
      console.log(event)
    }

    onMounted(async () => {
      const api = await axios.get(url);
      api.data.features.map(f => !/overig/i.test(f.properties.Vogel) && birds.value.add(f.properties.Vogel));

      mapboxgl.accessToken = 'pk.eyJ1IjoiZWRqYSIsImEiOiJjbDR6aGd4cDgwa2JiM3B1bDZ3NmgzaGpsIn0.oET3mVlFz2tbZDeJVBIrFg';
      const map = new mapboxgl.Map({
        container: "map",
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [4.901157, 52.370217],
        zoom: 13
      });

      map.on('load', () => {
        map.addSource('birds', {
          type: 'geojson',
          // Use a URL for the value for the `data` property.
          data: api.data
        });
      })
       
      map.on('data', async () => {
        // TODO: Here we want to load a layer
        // TODO: Here we want to load/setup the popup\
        
        // const data = api.data
        // data.features = data.features.filter(f => f.properties.Vogel === value.value);
        // console.log(data)

        
        if (map.getSource('birds') && !map.getLayer('birds-layer')) {
          map.addLayer({
            'id': 'birds-layer',
            'type': 'circle',
            'source': 'birds',
            'paint': {
              'circle-radius': 4,
              'circle-color': [
                'match',
                ['get', 'Vogel'],
                'Spreeuw',
                'green',
                'Huismus',
                'orange',
                'Gierzwaluw',
                'blue',
                'Boerenzwaluw',
                'red',
                'Huiszwaluw',
                'black',
                'Overig',
                'grey',
                'overig',
                'grey',
                'white'
              ],
              'circle-stroke-width': 1,
              //'circle-color': 'red',
              'circle-stroke-color': 'black'
            }
          });
        }
      });
    });

    return {
      birds,
      birdLayers
    }
  }
}
</script>
<style lang="scss">
body { margin: 0; padding: 0; }
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 2em;

  a {
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
#map {
  height: 100vh;
}
</style>
