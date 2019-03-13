
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import GeoJSON from 'ol/format/GeoJSON.js';
import { OSM, Vector as VectorSource } from 'ol/source.js';
import { Vector as VectorLayer} from 'ol/layer.js';
import { transform } from 'ol/proj.js';
import { Fill, Stroke, Style, Text, Icon } from 'ol/style.js';
import { getGeoJsonFile } from '../../components/getGeo'
export const map = {
  rawData: null,
  myLayer: null,
  container: null,
  myMap: null,
  mousePos: null,
  styleCache: {},
  async create({ ...args }) {
    try {
      this.rawData = null
      return Object.assign({}, this, { ...args })
    } catch (e) { Promise.reject(e) }
  },
  async refresh() {
    try {
      this.updateCoords()
    }
    catch (e) { Promise.reject(e) }
  },
  updateCoords() {
    //transform from lat/lon to UTM
    if (!this.rawData) {
      return
    }
    this.rawData.features.forEach(feature => {
      feature.geometry.coordinates = this._transform(feature.geometry.coordinates)
    })
  },
  addFeature(raw) {
    this.rawData = raw
    let center = [raw.features[0].geometry.coordinates[0], raw.features[0].geometry.coordinates[1]]
    raw.features[0].geometry.coordinates
    this.myMap.dispose()
    this.styleCache = []
    this.myMap = this.getMapObject(center)
  },
  getMapObject(center = [-122.25, 37.4]) {
    this.updateCoords()
    this.container = document.getElementById('map');
    this.myLayer = new TileLayer({
      source: new OSM({
        url: 'https://maps-cdn.salesboard.biz/styles/klokantech-3d-gl-style/{z}/{x}/{y}.png',
      })
    })
    let layers = [
      this.myLayer,
      this.getVectorLayer(),
    ]
    this.myMap = new Map({
      target: 'map',
      layers: layers,
      view: new View({
        center: this._transform(center),
        zoom: 15
      })
    })
    return this.myMap
  },
  getVectorLayer() {
    let source = this.getVectorSource()
    return new VectorLayer({
      source: source,
      style: this.styleFeature.bind(this),
    })
  },
  getVectorSource() {
    let f = {
      format: new GeoJSON({
        extractStyles: false
      })
    }
    if (this.rawData) {
      f.features = (new GeoJSON()).readFeatures(this.rawData)
    }
    return new VectorSource(f)
  },
  styleFeature(feature) {
    let place = parseFloat(feature.get("place"))
    let style = this.styleCache[place]
    if (!style) {
      let canvas = (document.createElement('canvas'))
      let ctx = canvas.getContext('2d')
      let size = 10
      canvas.width = size
      canvas.height = size
      ctx.fillStyle = 'red'
      ctx.beginPath()
      ctx.arc(size / 2, size / 2, (size / 2), Math.PI * 2, false)
      ctx.fill();
      ctx.stroke();
      style = new Style({
        image: new Icon({
          img: canvas,
          imgSize: [size, size],
        }),
        text: new Text({
          font: '15px Arial,sans-serif',
          overflow: true,
          fill: new Fill({
            color: '#000'
          }),
          stroke: new Stroke({
            color: '#fff',
            width: 1
          })
        })
      })
      this.styleCache[place] = style;
    }
    return style
  },
  _transform(coord) {
    return transform(coord, 'EPSG:4326', 'EPSG:3857')
  },
}