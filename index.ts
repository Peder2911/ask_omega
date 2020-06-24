
import axios from "axios"
import "leaflet/dist/leaflet.css"
import "./sass/style.sass"
import {curry} from "ramda"

import {State} from "./State"

import {MapRendererFactory} from "./systems/MapRenderer"
import {CursorFactory} from "./systems/Cursor"
import {StyleFactory} from "./systems/Style"

import {SparseKDBush} from "./shims"

import {createAcledEvent} from "./entities/Acled"
import * as L from "leaflet"


const S = new State()
const Map = new L.Map("map",{zoomAnimation: false})
S.Systems.push(MapRendererFactory(S,Map))
S.Systems.push(CursorFactory(S,Map))
S.Systems.push(StyleFactory(S))
// S.Systems.push(PopulatorFactory(Cursor)) ?
// How to create a system that reacts to
// user input...

const main = ()=>{
   S.Systems.forEach((s)=>s())
   requestAnimationFrame(main)
}
main()

let indices: number[] = []
axios.get("http://localhost:8000/acled/?iso3=NGA")
   .then((r)=>{
      let BushIndex = S.Index.get()
      indices = r.data.map(curry(createAcledEvent)(S,BushIndex))

      S.Components.KDBush[BushIndex] = new SparseKDBush(indices,r.data,
         d=>d.geometry.coordinates[0],
         d=>d.geometry.coordinates[1]
      )
})

