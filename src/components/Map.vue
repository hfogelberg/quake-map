<template>
  <div class="quakes">
    <header class="header">
      <h1 class="primary-header">Quake Map ({{formYesterday}} - {{formToday}})</h1>
    </header>

    <div class="map-container">
      <ul class="legend">
        <li><img src="/yellow-circle.svg"  class="img" /> Light to moderate</li>
        <li><img src="/orange-circle.svg" class="img"/> Medium to heavy</li>
        <li><img src="/red-circle.svg" class="img"/> Severe<li>
        <li><img src="/tsunami.svg" /> Tsunami warning</li>
        <li><hr /></li>
        <li>Data by <a href="https://earthquake.usgs.gov" target="_blank">USGS</a></li>
        <li><hr /></li>
        <li><a href="https://henrikfogelberg.com" _target="blank">Henrik Fogelberg</a></li>
        <li>Code at <a href="https://github.com/hfogelberg/quake-map">Githbub</a></li>
        <li><hr /></li>
      </ul>
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
        map: null,
        formYesterday: null,
        formToday: null
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

      this.formYesterday = moment(yesterday).format("ddd Do");
      this.formToday = moment(today).format("ddd Do");

      let url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${this.yesterday}&endtime=${this.today}`

      axios.get(url)
          .then((res) => {
            const features = res.data.features;

            let quakes = features.map((quake) => {
              let icon = '';
              if (quake.properties.tsunami == 1) {
                icon = 'tsunami.svg';
              } else if (quake.properties.mag < 4) {
                icon = 'yellow-circle.svg';
              } else if (quake.properties.mag < 6) {
                icon = 'orange-circle.svg';
              } else {
                icon = 'red-marker.svg';
              };

              let content = `
                <div class="info-box">
                  <h2 class="secondary-header">${quake.properties.place}</h2><br>
                  <p class="info-box__description">
                    ${moment(quake.properties.time).format("ddd Do HH:mm")} utc<br />
                    Magnitude: ${quake.properties.mag}<br />
                    <br />
                    <a href="${quake.properties.url}" target="_blank">Details</a>
                  </p>
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

.img {
  width: 2rem;
}

.quakes {
  width: 100vw;
  height: 100vh;
  position: absolute;
}

.header {
  height: 5vh;
}

.map-container {
  margin-top: 5vh;
  display: flex;
  width: 100vw;
  height: 95vh;
}

.legend {
  padding-left: 1rem;
  flex: .15;
  list-style: none;
  color: $main-text-color;
}

.legend > li {
  line-height: 2rem;
  margin-bottom: .7rem;
}

#myMap {
  flex: .85;
  height: 90%;
  width: 90%;
  margin-right: 3rem;
}
</style>
