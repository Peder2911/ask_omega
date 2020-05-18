
import {MultiPolygon,Point,Feature} from "geojson"
import axios from "axios"
import * as L from "leaflet"
import "leaflet/dist/leaflet.css"
import "./sass/style.sass"

enum style {
   color,
   lineWidth
}

const indices = (a: string[], e: string): number[]=>{
   let idxs = []
   let first = a.indexOf(e)
   if(first === -1){
      return []
   }

   let last = a.lastIndexOf(e)
   if(first === last){
      return [first]
   }

   idxs.push(first)

   let current = first
   while(current != last){
      current = a.indexOf(e, current + 1)
      idxs.push(current)
   }

   return idxs
}

class Components {
   // Grouping
   Layer: number[] = []

   // Rendering 
   Style: string[] = []
   Visible: boolean[] = []

   // Geometry

   Point: Point[] = []
   Polygon: MultiPolygon[] = []

   In: number[][] = []

   // Metadata
   Name: string[] = []
   EventType: string[] = []
   Fatalities: number[] = []
   Datestring: string[] = []
}
const COMPONENTS = new Components()

const ENTITIES: number[] = []

class Index {
   idx = 0
   get() {
      let idx

      if(this.idx <= 9007199254740991){
         idx = this.idx ++
      } else {
         console.log("WARNING reset index!!")
         idx = this.idx = 1
      }
      
      ENTITIES.push(idx)
      return idx
   }
}

let INDEX = new Index()

const createPoint = (point:Point)=>{
   let index = INDEX.get()
   COMPONENTS.Point[index] = point
   return index
}

const createCountry = (r: Feature & {"geometry":MultiPolygon,"id":string})=>{
   let index = INDEX.get()
   COMPONENTS.Polygon[index] = r.geometry 
   COMPONENTS.Name[index] = r.id 
   return index
}

enum Layers {
   Acled,
   Selector
}

type AcledFeature = {
   "geometry": Point,
   "properties": {
      "eventType":string,
      "date":string,
      "fatalities":number
      }
   }
const createAcledEvent = (r: Feature & AcledFeature)=>{
   let index = INDEX.get()
   COMPONENTS.Point[index] = r.geometry 
   COMPONENTS.EventType[index] = r.properties.eventType
   COMPONENTS.Fatalities[index] = r.properties.fatalities
   COMPONENTS.Datestring[index] = r.properties.date
   return index
}

function deleteEntity(idx){
   Object.keys(COMPONENTS).forEach((name)=>{
      delete(COMPONENTS[name][idx])
   })
}

let a = createPoint({"type":"Point","coordinates":[1,1]})
let b = createPoint({"type":"Point","coordinates":[1,2]})
let c = createPoint({"type":"Point","coordinates":[1,2]})

/*
axios.get("http://localhost:8000/countries/AGO")
   .then((r)=>{
      let angola = createCountry(r.data)
      console.log(angola)
      console.log(COMPONENTS.Name[angola])
   })
   */
/*
let acleds: number[] = []
axios.get("http://localhost:8000/acled/?iso3=AGO")
   .then((r)=>{
      acleds = r.data.map(createAcledEvent)
      console.log(acleds)

      acleds.forEach((idx)=>{
         COMPONENTS.Layer[idx] = Layers.Acled
      })

   })
   */


let map = new L.Map("map")
map.setView([50,0],3)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
	 attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

createPoint({"type":"Point","coordinates":[50,0]})
let canvas = L.DomUtil.create('canvas', 'leaflet-heatmap-layer');

var size = map.getSize();
canvas.width = size.x;
canvas.height = size.y;

var animated = map.options.zoomAnimation && L.Browser.any3d;
L.DomUtil.addClass(canvas, 'leaflet-zoom-' + (animated ? 'animated' : 'hide'));


map._panes.overlayPane.appendChild(canvas);        
let topLeft = map.containerPointToLayerPoint([0, 0]);
L.DomUtil.setPosition(canvas, topLeft);

let ctx = canvas.getContext("2d")
console.log(ctx)


COMPONENTS.Point.forEach((p)=>{
   console.log(p)
   ctx.fillRect(p.coordinates[0],p.coordinates[1],10,10)
})
