
import axios from "axios"
import "leaflet/dist/leaflet.css"
import "./sass/style.sass"
import {curry} from "ramda"

import {State} from "./State"

import {MapRendererFactory} from "./systems/MapRenderer"
import {CursorFactory} from "./systems/Cursor"
import {StyleFactory} from "./systems/Style"

import {createAcledEvent} from "./entities/Acled"
import * as L from "leaflet"

import KDBush from "kdbush"

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

class SparseKDBush {
   // The KDBush implementation does not work with
   // sparse matrices, which is the foundation of the
   // ECS system used here. Therefore, i wrap it
   // and make it return indices mapped to the indices
   // in the sparse matrix which contains the actual entities. 
   _indices: number[] = []
   _bush: KDBush

   constructor(indices,data,fna,fnb){
      this._bush = new KDBush(data,fna,fnb)
      this._indices = indices
   }

   within(x,y,r){
      return this._realIndices(
         this._bush.within(x,y,r)
      )
   }

   range(minx,miny,maxx,maxy){
      return this._realIndices(
         this._bush.range(minx,miny,maxx,maxy)
      )
   }

   _realIndices(bushindices){
      return bushindices.map(idx=>this._indices[idx])
   }
}

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

