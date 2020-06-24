
import {MultiPolygon} from "geojson"
import KDBush from "kdbush"

export class State {
   Entities: number[] = []
   Components = new Components()
   Systems: any[] = []

   Index = new Index(this)

   Flags = new Flags() 
}

class Flags {
   doingSomething = false,
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
   KDBush: KDBush[] = []

   In: number[][] = []

   // Metadata
   Name: string[] = []
   EventType: string[] = []
   Fatalities: number[] = []

   Datestring: string[] = []
}

class Index {
   state: State

   constructor(state){
      this.state = state
   }

   idx = 0
   get() {
      let idx

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
