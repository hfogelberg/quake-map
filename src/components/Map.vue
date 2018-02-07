<template>
  <div class="quakes">
    <header class="header">
      <h1 class="primary-header">Quake Map</h1>
    </header>

    <div class="map-container">
      <div id="myMap">
        <p>Fetching location and setting up map ... </p>
      </div>
    </div>
  </div>

</template>

<script>
import moment from 'moment';
import axios from 'axios';

export default {
  data() {
    return {
        lat: 0.0,
        lng: 0.0,
        latLng: {},
        quakes: [],
        map: null
      }
  },
  name: 'home',

  mounted() {
    this.initMap();
    this.getQuakes();
  },

  methods: {
    getQuakes() {
      let today = new Date();
      let yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      today = moment(today).format("YYYY-MM-DD");
      yesterday = moment(yesterday).format("YYYY-MM-DD");

      let url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${yesterday}&endtime=${today}`

      axios.get(url)
          .then((res) => {
            const features = res.data.features;

            let quakes = features.map((quake) => {
              let icon = '';
              if (quake.properties.mag < 4) {
                icon = 'yellow-circle.svg';
              } else if (quake.properties.mag < 6) {
                icon = 'orange-circle.svg';
              } else {
                icon = 'red-marker.svg'
              };

              let content = `
                <div>
                  <h2 class="secondary-header">${quake.properties.place}</h2><br>
                  <p>Magnitude: ${quake.properties.mag}<p>
                  <p>${moment(quake.properties.time).format("DD HH:mm")} utc</p>
                  <p><a href="${quake.properties.url}" target="_blank">Details</a></p>
                </div>
              `

              return {
                lat: quake.geometry.coordinates[1],
                lng: quake.geometry.coordinates[0],
                icon: icon,
                content: content
              }
            });
            this.quakes = quakes;

            this.iterateQuakes();
          })
          .catch((err) => {
            console.log(err);
          });
    },

    iterateQuakes() {
        this.quakes.forEach((quake) => {
            const position = new google.maps.LatLng(quake.lat, quake.lng);

            let infowindow = new google.maps.InfoWindow({
              content: quake.content
            });

            const marker = new google.maps.Marker({ 
              position,
              map: this.map,
              icon: quake.icon,
            });

            marker.addListener('click', function() {
              infowindow.open(this.map, marker);
            });

        });
    },

    initMap() {
      this.map = new google.maps.Map(document.getElementById('myMap'), {
            center: {
              lat: this.lat,
              lng: this.lng
            },
            zoom: 2
        });
    }
  },
}
</script>

<style lang="scss" scoped>
@import "../sass/main.scss";

.quakes {
  width: 100vw;
  height: 100vh;
  position: absolute;
}

.header {
  height: 5vh;
}

.map-container {
  position: absolute;
  margin-top: 6vh;
  height: 95vh;
  width: 100vw;
}

#myMap {
  position: relative;
  margin: 0 auto; 
  height: 90%;
  width: 90%;
}
</style>
