
import {Point,Feature} from "geojson"
import axios from "axios"
import "leaflet/dist/leaflet.css"
import "./sass/style.sass"
import {curry} from "ramda"

import {State} from "./State"
import {MapRendererFactory} from "./systems/MapRenderer"

type AcledFeature = {
   "geometry": Point,
   "properties": {
      "eventType":string,
      "date":string,
      "fatalities":number
      }
   }

const createAcledEvent = function(S: State, r: Feature & AcledFeature):number{
      let index = S.Index.get()

      S.Components.Point[index] = r.geometry 
      S.Components.EventType[index] = r.properties.eventType
      S.Components.Fatalities[index] = r.properties.fatalities
      S.Components.Datestring[index] = r.properties.date

      return index
}

const S = new State()
S.Systems.push(MapRendererFactory(S,"map"))

//let acleds: number[] = []
axios.get("http://localhost:8000/acled/?iso3=AGO")
   .then((r)=>{
      r.data.map(curry(createAcledEvent)(S))
      //acleds = r.data.map(curry(createAcledEvent)(S))
})

const main = ()=>{
   S.Systems.forEach((s)=>s())
   requestAnimationFrame(main)
}
main()

/*
function deleteEntity(S:State, idx:number){
   Object.keys(S.Components).forEach((name)=>{
      delete(S.Components[name][idx])
   })
}
*/
