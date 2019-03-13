
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import GeoJSON from 'ol/format/GeoJSON.js';
import { OSM, Vector as VectorSource } from 'ol/source.js';
import { ATTRIBUTION } from 'ol/source/OSM.js';
import { Vector as VectorLayer, Heatmap as HeatmapLayer } from 'ol/layer.js';
import { transform } from 'ol/proj.js';
import { Circle as CircleStyle, Fill, Stroke, Style, Text, Icon } from 'ol/style.js';
import {getGeoJsonFile } from '../../components/getGeo'
export const map = {
  rawData: null,
  myLayer: null,
  container: null,
  myMap: null,
  mousePos: null,
  styleCache: {},

  async create({ ...args }) {
    try {
      this.rawData = null// await this.loadGeoJson()
      // this.loadGeoJson().then(result =>{
      //   this.rawData = result
      //   console.log('success', this.rawData)
      // }).catch(reason =>{
      //   console.log(reason)
      // })
      return Object.assign({}, this, { ...args })
      } catch (e) { Promise.reject(e) }
  },
  async refresh() {
    try {
    //this.rawData = null
      this.updateCoords()
    }
    catch (e) { Promise.reject(e) }
  },

  async loadInfo() {
    return Promise.resolve(true)
  //   try {
  //     let path = this.type === '0' ? 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson'
  //       : this.type === '1' ? 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson'
  //         : 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'
  //     let result = await window.fetch(path).catch(reason => { return reason })
  //     if (!result.ok) return Promise.reject(result)
  //     let jsResult = await result.json().catch(reason => { return reason })
  //     if (!jsResult) return 0
  //     //Fix up data
  //     let fixed = {
  //       features: [],
  //       bbox:jsResult.bbox ? [...jsResult.bbox] : [],
  //       metadata:jsResult.metadata ? { ...jsResult.metadata } : {},
  //       type: jsResult.type,
  //     }
  //     jsResult.features.forEach(feature => {
  //       if (parseFloat(feature.properties.mag) < this.magThreshhold) return
  //       fixed.features = fixed.features.concat(feature)
  //     })
  //     return fixed
  //   }
  //   catch (e) { Promise.reject(e) }
    
  // }
  },
  updateContainer() {
    // this.container.addEventListener('mousemove', this.mouseMoveEvent);
    // this.container.addEventListener('mouseout', this.mouseOutEvent);
  },
  mouseMoveEvent(event) {
    this.mousePos = this.myMap.getEventPixel(event);
    this.myMap.render();
  },
  mouseOutEvent(event) {
    this.mousePos = null;
    this.myMap.render();
  },
  updateCoords() {
    //transform from lat/lon to UTM
    if (!this.rawData){
      return
    }
    this.rawData.features.forEach(feature => {
      feature.geometry.coordinates = this._transform(feature.geometry.coordinates)
    })
  },
  addFeature(raw){
    this.rawData = raw
    this.updateCoords()
    //this.getMapObject()
  },
  async loadGeoJson() {
    getGeoJsonFile().then(result => {
      console.log(result)
    }).catch(reason => {
      console.log(reason)
    })
  },

  getMapObject() {
    this.updateCoords()
    this.container = document.getElementById('map');
    this.updateContainer = this.updateContainer.bind(this)
    this.mouseMoveEvent = this.mouseMoveEvent.bind(this)
    this.mouseOutEvent = this.mouseOutEvent.bind(this)
    let center = [-122.25, 37.4]
    let attr = { }
    this.myLayer = new TileLayer({
      source: new OSM({
        url: 'https://maps-cdn.salesboard.biz/styles/klokantech-3d-gl-style/{z}/{x}/{y}.png',
        
      })
    })
    this.updateContainer()
    let layers = [
      this.myLayer,
      this.getVectorLayer(),
    ]
    this.myMap = new Map({
      target: 'map',
      layers: layers,
      view: new View({
        center: this._transform(center),
        zoom: 10
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
    let f ={ 
      format: new GeoJSON({
        extractStyles: false
      })
     }
    if (this.rawData){
      f.features = (new GeoJSON()).readFeatures(this.rawData)
    }
     return new VectorSource(f)
    },
  styleFeature(feature) {
    console.log('$$',feature)
    //let place = parseFloat(feature.ol_uid)
    let place = parseFloat(feature.get("place"))
    let geo = feature.get('geometry')
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
      let text = `Place: ${String(feature.get('place'))}`

     // style.getText().setText(text)
      this.styleCache[place] = style;
    }
    return style
  },
  _transform(coord) {
    return transform(coord, 'EPSG:4326', 'EPSG:3857')
  },

}