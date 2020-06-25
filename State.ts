
import {MultiPolygon} from "geojson"
import {SparseKDBush} from "./shims"

export class State {
   Entities: number[] = []
   Components = new Components()
   Systems: any[] = []

   Index = new Index(this)

   Flags = new Flags() 
}

class Flags {
   doingSomething = false
   Filter = false
}

class Components {
   // Grouping
   Layer: number[] = []

   // Rendering 
   Style: string[] = []
   Visible: boolean[] = []
   Size: number[] = []
   Highlighted: boolean[] = []
   Refresh: boolean[] = []

   // Geometry

   Point: Float32Array[] = []
   Polygon: MultiPolygon[] = []
   SpIndex: number[] = []
   KDBush: SparseKDBush[] = []

   In: number[][] = []

   // Metadata
   Name: string[] = []
   EventType: string[] = []
   Fatalities: number[] = []

   EvtDate: Date[] = []
}

class Index {
   state: State

   constructor(state:State){
      this.state = state
   }

   idx = 0
   get() {
      let idx: number

      if(this.idx <= 9007199254740991){
         idx = this.idx ++
      } else {
         console.log("WARNING reset index!!")
         idx = this.idx = 1
      }
      
      this.state.Entities.push(idx)
      return idx
   }
}
